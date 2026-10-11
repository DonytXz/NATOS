import { DestroyRef, EventEmitter, Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

export interface LoginCredentials { username: string; password: string; }

/** Only return to a local route; avoid sending the user back into the auth form. */
export function safeReturnUrl(value: string | null | undefined): string {
  if (!value || !value.startsWith('/') || value.startsWith('//') || /[\\\u0000-\u001f]/.test(value)) {
    return '/admin/pedidos';
  }
  try {
    const decoded = decodeURIComponent(value);
    if (decoded.startsWith('//') || /[\\\u0000-\u001f]/.test(decoded) || /^\/(acceso|registro|Iniciar|Registrar)(?:[/?#]|$)/i.test(decoded)) {
      return '/admin/pedidos';
    }
  } catch { return '/admin/pedidos'; }
  return value;
}

function usableToken(value: unknown): value is string {
  if (typeof value !== 'string' || !value.trim() || value !== value.trim() || /^(null|undefined)$/i.test(value)) return false;
  // Opaque tokens remain supported. Only apply expiry when the existing token supplies it.
  const parts = value.split('.');
  if (parts.length === 3) {
    try {
      const encoded = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(encoded));
      if (payload && typeof payload.exp === 'number' && payload.exp * 1000 <= Date.now()) return false;
    } catch {
      // A token is not assumed to be a JWT; validity is ultimately decided by the API.
    }
  }
  return true;
}

@Injectable({ providedIn: 'root' })
export class LoginService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private token: string | null = this.readToken();
  private readonly session = signal(usableToken(this.token));
  readonly loggedIn = this.session.asReadonly();
  /** Compatibility for existing consumers while navigation moves to the signal. */
  readonly change = new EventEmitter<boolean>();

  constructor() {
    const syncSession = (event: StorageEvent): void => {
      if (event.key !== 'token' && event.key !== null) return;
      if (usableToken(event.newValue)) {
        this.token = event.newValue;
        this.session.set(true);
        this.change.emit(true);
      } else if (this.session() && /^\/admin(?:\/|$)/.test(this.router.url)) {
        this.expireSession();
      } else {
        this.clearSession();
      }
    };
    window.addEventListener('storage', syncSession);
    inject(DestroyRef).onDestroy(() => window.removeEventListener('storage', syncSession));
  }

  login(credentials: LoginCredentials) {
    return this.http.post<unknown>(`${environment.apiUrl}/user/login`, credentials).pipe(
      tap(response => this.setSession(response))
    );
  }

  setSession(response: unknown): void {
    const token = response && typeof response === 'object' && 'jwtoken' in response ? response.jwtoken : null;
    if (!usableToken(token)) {
      this.clearSession();
      throw new Error('El servidor no devolvió una sesión válida. Intenta de nuevo.');
    }
    this.token = token;
    try { localStorage.setItem('token', token); } catch { /* Session can still work in memory. */ }
    this.session.set(true);
    this.change.emit(true);
  }

  eslogueado(): boolean {
    if (!usableToken(this.token)) this.clearSession();
    return this.session();
  }

  logout(): void {
    this.clearSession();
    void this.router.navigate(['/acceso']);
  }

  expireSession(): void {
    const returnUrl = safeReturnUrl(this.router.url);
    this.clearSession();
    void this.router.navigate(['/acceso'], { queryParams: { returnUrl, sesion: 'expirada' } });
  }

  private clearSession(): void {
    this.token = null;
    try { localStorage.removeItem('token'); } catch { /* Browser storage may be disabled. */ }
    if (this.session()) {
      this.session.set(false);
      this.change.emit(false);
    }
  }

  private readToken(): string | null {
    try {
      const token = localStorage.getItem('token');
      if (usableToken(token)) return token;
      localStorage.removeItem('token');
    } catch { /* Browser storage may be disabled. */ }
    return null;
  }
}

/** Respect the current API contract: handle 401 without inventing a credentials header. */
export const sessionInterceptor: HttpInterceptorFn = (request, next) => {
  const auth = inject(LoginService);
  const apiBase = environment.apiUrl.replace(/\/$/, '');
  const isApiRequest = request.url === apiBase || request.url.startsWith(`${apiBase}/`);
  const isAuthRequest = request.url.startsWith(`${apiBase}/user/`);
  return next(request).pipe(catchError((error: unknown) => {
    if (isApiRequest && !isAuthRequest && error instanceof HttpErrorResponse && error.status === 401 && auth.loggedIn()) {
      auth.expireSession();
    }
    return throwError(() => error);
  }));
};
