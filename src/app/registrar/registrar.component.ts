import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';
import { RegistrarService } from '../servicios/registrar.service';

@Component({
  selector: 'app-registrar',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './registrar.component.html',
  styleUrls: ['../iniciar/iniciar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegistrarComponent {
  private readonly registrar = inject(RegistrarService);
  private readonly destroyRef = inject(DestroyRef);
  readonly form = inject(NonNullableFormBuilder).group({
    codigo: ['', [Validators.required, Validators.pattern(/\S/)]],
    username: ['', [Validators.required, Validators.pattern(/\S/)]],
    password: ['', Validators.required]
  });
  readonly pending = signal(false);
  readonly error = signal('');
  readonly success = signal(false);
  readonly showPassword = signal(false);

  insertar(): void {
    if (this.pending()) return;
    this.form.markAllAsTouched();
    this.error.set('');
    this.success.set(false);
    if (this.form.invalid) return;
    const values = this.form.getRawValue();
    this.pending.set(true);
    this.registrar.insertar({ ...values, codigo: values.codigo.trim(), username: values.username.trim() }).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.pending.set(false))
    ).subscribe({
      next: () => { this.success.set(true); this.form.reset(); },
      error: (error: unknown) => this.error.set(error instanceof HttpErrorResponse && error.status === 0
        ? 'No pudimos conectar con el servicio. Revisa tu conexión e intenta de nuevo.'
        : 'No se pudo completar el registro. Revisa el código y los datos, o intenta más tarde.')
    });
  }
}
