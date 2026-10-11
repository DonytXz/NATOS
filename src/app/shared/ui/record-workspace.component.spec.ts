import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { By } from '@angular/platform-browser';
import { of, Subject, throwError } from 'rxjs';
import { BusinessRecord, RecordWorkspace, RecordWorkspaceComponent } from './record-workspace.component';

@Component({
  standalone: true,
  imports: [RecordWorkspaceComponent],
  template: '<app-record-workspace [config]="config" />',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class OnPushWorkspaceHost {
  @Input({ required: true }) config!: RecordWorkspace;
}

describe('RecordWorkspaceComponent', () => {
  let fixture: ComponentFixture<RecordWorkspaceComponent>;
  let component: RecordWorkspaceComponent;
  let config: RecordWorkspace;
  let row: BusinessRecord;

  beforeEach(async () => {
    row = { id: '17', descripcion: 'Tarima de pino', cantidad: '20', precio: '150.50' };
    config = {
      title: 'Tarimas', singular: 'Tarima', description: 'Inventario', group: 'Inventario', nameKey: 'descripcion',
      fields: [
        { key: 'id', label: 'Código', required: true },
        { key: 'descripcion', label: 'Descripción', required: true },
        { key: 'cantidad', label: 'Cantidad', kind: 'number', required: true, integer: true, min: 0 },
        { key: 'precio', label: 'Precio', kind: 'money', required: true, min: .01 },
      ],
      list: vi.fn(() => of([row])),
      create: vi.fn(() => of({})),
      update: vi.fn(() => of({})),
      remove: vi.fn(() => of({})),
    };
    await TestBed.configureTestingModule({ imports: [RecordWorkspaceComponent, OnPushWorkspaceHost] }).compileComponents();
    fixture = TestBed.createComponent(RecordWorkspaceComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('config', config);
    fixture.detectChanges();
  });

  it('keeps the loaded row unchanged while editing and cancelling a draft', () => {
    component.edit(row);
    component.draft['descripcion'] = 'Un cambio sin guardar';
    component.draft['cantidad'] = 5;
    expect(row.descripcion).toBe('Tarima de pino');
    expect(row.cantidad).toBe('20');
    component.cancel();
    fixture.detectChanges();
    expect(component.editorOpen).toBe(false);
    expect(component.rows[0]).toEqual(row);
    expect(fixture.nativeElement.textContent).toContain('Tarima de pino');
    expect(fixture.nativeElement.textContent).not.toContain('Un cambio sin guardar');
    expect(config.update).not.toHaveBeenCalled();
  });

  it('preserves the draft and original row when saving fails', () => {
    config.update = vi.fn(() => throwError(() => new Error('offline')));
    component.edit(row);
    component.draft['descripcion'] = 'Tarima reparada';
    component.save();
    fixture.detectChanges();
    expect(component.pending).toBe(false);
    expect(component.editorOpen).toBe(true);
    expect(component.draft['descripcion']).toBe('Tarima reparada');
    expect(row.descripcion).toBe('Tarima de pino');
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain('Tus cambios siguen en el formulario');
    expect(config.list).toHaveBeenCalledOnce();
  });

  it('prevents a duplicate mutation and cancelling while saving', () => {
    const response = new Subject<unknown>();
    config.update = vi.fn(() => response);
    component.edit(row);
    component.draft['cantidad'] = 8;
    component.save();
    component.save();
    component.cancel();
    fixture.detectChanges();
    expect(config.update).toHaveBeenCalledExactlyOnceWith({ ...row, cantidad: '8' });
    expect(component.pending).toBe(true);
    expect(component.editorOpen).toBe(true);
    expect(fixture.nativeElement.querySelector('fieldset').disabled).toBe(true);
    response.next({});
    response.complete();
    expect(component.pending).toBe(false);
    expect(component.editorOpen).toBe(false);
    expect(config.list).toHaveBeenCalledTimes(2);
  });

  it('requires valid quantities and prices before sending the existing payload', () => {
    component.edit(row);
    component.draft['cantidad'] = -1;
    component.draft['precio'] = 0;
    component.save();
    fixture.detectChanges();
    expect(config.update).not.toHaveBeenCalled();
    expect(fixture.nativeElement.querySelectorAll('[aria-invalid="true"]').length).toBe(2);
    component.draft['cantidad'] = 1.5;
    expect(component.fieldError(config.fields[2])).toContain('entera');
    component.draft['cantidad'] = 0;
    component.draft['precio'] = 4.5;
    component.save();
    expect(config.update).toHaveBeenCalledExactlyOnceWith({ ...row, cantidad: '0', precio: '4.5' });
  });

  it('names the record in delete confirmation and preserves it on failure', () => {
    const response = new Subject<unknown>();
    config.remove = vi.fn(() => response);
    component.askDelete(row);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="alertdialog"]').textContent).toContain('Tarima de pino');
    component.confirmDelete();
    component.confirmDelete();
    expect(config.remove).toHaveBeenCalledExactlyOnceWith(row);
    response.error(new Error('offline'));
    fixture.detectChanges();
    expect(component.rows).toEqual([row]);
    expect(component.pendingDelete).toEqual(row);
    expect(component.pending).toBe(false);
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain('No pudimos confirmar la eliminación');
    component.cancelDelete();
    expect(component.pendingDelete).toBeNull();
  });

  it('shows loading failure separately from an empty list and supports retry', () => {
    config.list = vi.fn(() => throwError(() => new Error('offline')));
    component.load();
    fixture.detectChanges();
    expect(component.listError).not.toBe('');
    expect(component.rows).toEqual([row]);
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain('No pudimos cargar');
    config.list = vi.fn(() => of([]));
    component.load();
    fixture.detectChanges();
    expect(component.listError).toBe('');
    expect(fixture.nativeElement.textContent).toContain('Todavía no hay registros');
  });

  it('searches loaded fields without issuing network requests', () => {
    component.query = 'pino';
    expect(component.filteredRows).toEqual([row]);
    component.query = 'proveedor inexistente';
    fixture.detectChanges();
    expect(component.filteredRows).toEqual([]);
    expect(fixture.nativeElement.textContent).toContain('Sin coincidencias');
    expect(config.list).toHaveBeenCalledOnce();
  });

  it('preserves server metadata and untouched types when updating or deleting a loaded record', () => {
    const returnedRecord: BusinessRecord = { ...row, id: 17, _id: 'database-key', metadata: { version: 2 } };
    component.edit(returnedRecord);
    component.draft['descripcion'] = 'Tarima reparada';
    component.save();
    expect(config.update).toHaveBeenCalledExactlyOnceWith({ ...returnedRecord, descripcion: 'Tarima reparada' });
    component.askDelete(returnedRecord);
    component.confirmDelete();
    expect(config.remove).toHaveBeenCalledExactlyOnceWith(returnedRecord);
    expect(returnedRecord.descripcion).toBe('Tarima de pino');
  });

  it('allows verifying an uncertain save result without discarding the draft or issuing another mutation', () => {
    config.update = vi.fn(() => throwError(() => new Error('timeout')));
    component.edit(row);
    component.draft['descripcion'] = 'Cambio por verificar';
    component.save();
    const refreshedRecord = { ...row, descripcion: 'Cambio por verificar' };
    config.list = vi.fn(() => of([refreshedRecord]));
    component.load();
    fixture.detectChanges();
    expect(component.rows).toEqual([refreshedRecord]);
    expect(component.draft['descripcion']).toBe('Cambio por verificar');
    expect(component.editorOpen).toBe(true);
    expect(config.update).toHaveBeenCalledOnce();
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain('verificar el resultado');
  });

  it('renders delayed list and mutation responses beneath a clean OnPush parent', async () => {
    const listResponse = new Subject<BusinessRecord[]>();
    const saveResponse = new Subject<unknown>();
    config.list = vi.fn(() => listResponse);
    config.update = vi.fn(() => saveResponse);
    const host = TestBed.createComponent(OnPushWorkspaceHost);
    host.componentRef.setInput('config', config);
    host.autoDetectChanges();
    await host.whenStable();
    expect(host.nativeElement.textContent).toContain('Cargando tarimas');

    listResponse.next([row]);
    listResponse.complete();
    await host.whenStable();
    expect(host.nativeElement.textContent).not.toContain('Cargando tarimas');
    expect(host.nativeElement.querySelectorAll('tbody tr').length).toBe(1);
    expect(host.nativeElement.textContent).toContain('Tarima de pino');

    host.nativeElement.querySelector('[aria-label="Editar Tarima de pino"]').click();
    await host.whenStable();
    host.nativeElement.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await host.whenStable();
    expect(host.nativeElement.querySelector('fieldset').disabled).toBe(true);

    saveResponse.error(new Error('timeout'));
    await host.whenStable();
    expect(host.nativeElement.querySelector('fieldset').disabled).toBe(false);
    expect(host.nativeElement.querySelector('[role="alert"]').textContent).toContain('No pudimos confirmar');

    const retryResponse = new Subject<unknown>();
    config.update = vi.fn(() => retryResponse);
    config.list = vi.fn(() => of([row]));
    host.nativeElement.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await host.whenStable();
    retryResponse.next({});
    retryResponse.complete();
    await host.whenStable();
    expect(host.nativeElement.querySelector('form')).toBeNull();
    expect(host.nativeElement.textContent).toContain('Registro guardado');
    expect(host.debugElement.query(By.directive(RecordWorkspaceComponent)).componentInstance.pending).toBe(false);
  });
});
