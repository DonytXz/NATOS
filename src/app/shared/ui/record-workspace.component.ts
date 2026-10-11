import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, ElementRef, Input, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, finalize } from 'rxjs';

export type BusinessRecord = Record<string, unknown>;

export interface RecordField {
  key: string;
  label: string;
  required?: boolean;
  kind?: 'number' | 'money';
  min?: number;
  integer?: boolean;
  hint?: string;
}

export interface RecordWorkspace {
  title: string;
  singular: string;
  description: string;
  group: string;
  nameKey: string;
  fields: RecordField[];
  list: () => Observable<BusinessRecord[]>;
  create: (record: BusinessRecord) => Observable<unknown>;
  update: (record: BusinessRecord) => Observable<unknown>;
  remove: (record: BusinessRecord) => Observable<unknown>;
}

@Component({
  selector: 'app-record-workspace',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './record-workspace.component.html',
  styleUrls: ['./record-workspace.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class RecordWorkspaceComponent implements OnInit {
  @Input({ required: true }) config!: RecordWorkspace;
  private readonly destroyRef = inject(DestroyRef);
  private readonly changeDetector = inject(ChangeDetectorRef);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private returnFocus: HTMLElement | null = null;
  private originalRecord: BusinessRecord = {};
  private readonly money = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' });

  rows: BusinessRecord[] = [];
  draft: BusinessRecord = {};
  query = '';
  page = 1;
  readonly pageSize = 10;
  loading = false;
  pending = false;
  listError = '';
  mutationError = '';
  notice = '';
  editorOpen = false;
  editing = false;
  submitted = false;
  pendingDelete: BusinessRecord | null = null;

  ngOnInit(): void { this.load(); }

  get filteredRows(): BusinessRecord[] {
    const term = this.query.trim().toLocaleLowerCase('es-MX');
    return term ? this.rows.filter(row => this.config.fields.some(field =>
      String(row[field.key] ?? '').toLocaleLowerCase('es-MX').includes(term))) : this.rows;
  }

  get pageCount(): number { return Math.max(1, Math.ceil(this.filteredRows.length / this.pageSize)); }
  get visibleRows(): BusinessRecord[] {
    const current = Math.min(this.page, this.pageCount);
    return this.filteredRows.slice((current - 1) * this.pageSize, current * this.pageSize);
  }

  load(): void {
    if (this.loading || this.pending || ((this.editorOpen || this.pendingDelete) && !this.mutationError)) return;
    this.loading = true;
    this.listError = '';
    this.changeDetector.markForCheck();
    this.config.list().pipe(takeUntilDestroyed(this.destroyRef), finalize(() => {
      this.loading = false;
      this.changeDetector.markForCheck();
    })).subscribe({
      next: rows => {
        if (!Array.isArray(rows)) {
          this.listError = 'No pudimos leer los registros recibidos. Intenta actualizar la lista.';
          this.changeDetector.markForCheck();
          return;
        }
        this.rows = rows;
        this.page = Math.min(this.page, this.pageCount);
        this.changeDetector.markForCheck();
      },
      error: () => {
        this.listError = 'No pudimos cargar los registros. Revisa tu conexión o vuelve a iniciar sesión e inténtalo de nuevo.';
        this.changeDetector.markForCheck();
      },
    });
  }

  create(): void {
    if (this.pending || this.loading || this.editorOpen || this.pendingDelete) return;
    this.prepareEditor();
    this.editing = false;
    this.originalRecord = {};
    this.draft = Object.fromEntries(this.config.fields.map(field => [field.key, '']));
  }

  edit(row: BusinessRecord): void {
    if (this.pending || this.loading || this.editorOpen || this.pendingDelete) return;
    this.prepareEditor();
    this.editing = true;
    this.originalRecord = { ...row };
    this.draft = this.pickFields(row);
  }

  private prepareEditor(): void {
    this.rememberFocus();
    this.editorOpen = true;
    this.pendingDelete = null;
    this.submitted = false;
    this.mutationError = '';
    this.notice = '';
    this.focusAfterRender('#record-editor-title');
  }

  cancel(): void {
    if (this.pending) return;
    this.editorOpen = false;
    this.draft = {};
    this.originalRecord = {};
    this.submitted = false;
    this.mutationError = '';
    this.restoreFocus();
  }

  fieldError(field: RecordField): string {
    const raw = this.draft[field.key];
    const value = String(raw ?? '').trim();
    if (!value) return field.required ? `Ingresa ${field.label.toLocaleLowerCase('es-MX')}.` : '';
    if (field.kind) {
      const number = Number(value);
      if (!Number.isFinite(number)) return 'Ingresa un número válido.';
      if (field.integer && !Number.isSafeInteger(number)) return 'Ingresa una cantidad entera.';
      if (field.min !== undefined && number < field.min) {
        return field.min === 0 ? 'El valor no puede ser negativo.' : 'El valor debe ser mayor que cero.';
      }
    }
    return '';
  }

  save(): void {
    if (this.pending || this.loading || !this.editorOpen) return;
    this.submitted = true;
    if (this.config.fields.some(field => this.fieldError(field))) {
      this.focusAfterRender('[aria-invalid="true"]');
      return;
    }
    // Preserve server-provided fields and untouched values during edits. Existing
    // text inputs send strings for newly entered values; retain that wire format.
    const payload = { ...this.originalRecord, ...Object.fromEntries(this.config.fields.map(field => [
      field.key,
      this.editing && this.draft[field.key] === this.originalRecord[field.key]
        ? this.originalRecord[field.key]
        : String(this.draft[field.key] ?? '').trim(),
    ])) };
    this.pending = true;
    this.mutationError = '';
    this.changeDetector.markForCheck();
    const request = this.editing ? this.config.update(payload) : this.config.create(payload);
    request.pipe(takeUntilDestroyed(this.destroyRef), finalize(() => {
      this.pending = false;
      this.changeDetector.markForCheck();
    })).subscribe({
      next: () => {
        this.pending = false;
        this.editorOpen = false;
        this.draft = {};
        this.originalRecord = {};
        this.notice = 'Registro guardado. La lista se actualizará con los datos del servidor.';
        this.changeDetector.markForCheck();
        this.restoreFocus();
        this.load();
      },
      error: () => {
        this.mutationError = 'No pudimos confirmar que se guardó el registro. Tus cambios siguen en el formulario. Actualiza la lista para verificar el resultado antes de volver a intentar.';
        this.changeDetector.markForCheck();
      },
    });
  }

  askDelete(row: BusinessRecord): void {
    if (this.pending || this.loading || this.editorOpen || this.pendingDelete) return;
    this.rememberFocus();
    this.pendingDelete = { ...row };
    this.mutationError = '';
    this.notice = '';
    this.focusAfterRender('#record-delete-title');
  }

  cancelDelete(): void {
    if (this.pending) return;
    this.pendingDelete = null;
    this.mutationError = '';
    this.restoreFocus();
  }

  confirmDelete(): void {
    if (this.pending || this.loading || !this.pendingDelete) return;
    this.pending = true;
    this.mutationError = '';
    this.changeDetector.markForCheck();
    this.config.remove({ ...this.pendingDelete }).pipe(takeUntilDestroyed(this.destroyRef), finalize(() => {
      this.pending = false;
      this.changeDetector.markForCheck();
    })).subscribe({
      next: () => {
        this.pending = false;
        this.pendingDelete = null;
        this.notice = 'Registro eliminado.';
        this.changeDetector.markForCheck();
        this.focusAfterRender('#record-search');
        this.load();
      },
      error: () => {
        this.mutationError = 'No pudimos confirmar la eliminación. Actualiza la lista para verificar el resultado antes de volver a intentar.';
        this.changeDetector.markForCheck();
      },
    });
  }

  name(row: BusinessRecord): string { return String(row[this.config.nameKey] || row.id || this.config.singular); }

  display(row: BusinessRecord, field: RecordField): string {
    const value = row[field.key];
    if (value === null || value === undefined || value === '') return '—';
    return field.kind === 'money' && Number.isFinite(Number(value)) ? this.money.format(Number(value)) : String(value);
  }

  private pickFields(row: BusinessRecord): BusinessRecord {
    return Object.fromEntries(this.config.fields.map(field => [field.key, row[field.key] ?? '']));
  }

  private rememberFocus(): void {
    this.returnFocus = this.host.nativeElement.ownerDocument.activeElement as HTMLElement;
  }

  private restoreFocus(): void { this.returnFocus?.focus(); }

  private focusAfterRender(selector: string): void {
    setTimeout(() => {
      if (!this.destroyRef.destroyed) this.host.nativeElement.querySelector<HTMLElement>(selector)?.focus();
    });
  }
}
