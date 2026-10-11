import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';
import { LoginService, safeReturnUrl } from '../servicios/login.service';

@Component({
  selector: 'app-iniciar',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './iniciar.component.html',
  styleUrls: ['./iniciar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IniciarComponent {
  private readonly auth = inject(LoginService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  readonly form = inject(NonNullableFormBuilder).group({
    username: ['', [Validators.required, Validators.pattern(/\S/)]],
    password: ['', Validators.required]
  });
  readonly pending = signal(false);
  readonly error = signal('');
  readonly showPassword = signal(false);
  readonly expired = this.route.snapshot.queryParamMap.get('sesion') === 'expirada';

  login(): void {
    if (this.pending()) return;
    this.form.markAllAsTouched();
    this.error.set('');
    if (this.form.invalid) return;
    const values = this.form.getRawValue();
    this.pending.set(true);
    this.auth.login({ username: values.username.trim(), password: values.password }).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.pending.set(false))
    ).subscribe({
      next: () => {
        this.form.controls.password.reset();
        void this.router.navigateByUrl(safeReturnUrl(this.route.snapshot.queryParamMap.get('returnUrl')));
      },
      error: (error: unknown) => {
        this.error.set(error instanceof HttpErrorResponse
          ? error.status === 0 ? 'No pudimos conectar con el servicio. Revisa tu conexión e intenta de nuevo.'
            : error.status === 400 || error.status === 401 || error.status === 403 ? 'No pudimos iniciar sesión. Revisa tu usuario y contraseña.'
            : 'El servicio no está disponible en este momento. Intenta más tarde.'
          : 'El servidor no devolvió una sesión válida. Intenta de nuevo.');
      }
    });
  }
}
