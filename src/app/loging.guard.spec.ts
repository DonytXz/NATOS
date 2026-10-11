import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree, provideRouter } from '@angular/router';
import { LogingGuard } from './loging.guard';
import { LoginService } from './servicios/login.service';

describe('LogingGuard', () => {
  const auth = { eslogueado: vi.fn() };
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([]), { provide: LoginService, useValue: auth }] });
    auth.eslogueado.mockReturnValue(false);
  });
  it('returns a redirect UrlTree preserving the protected deep link', () => {
    const result = TestBed.inject(LogingGuard).canActivate({} as ActivatedRouteSnapshot, { url: '/admin/clientes?buscar=Ana' } as RouterStateSnapshot);
    expect(result).toBeInstanceOf(UrlTree);
    expect(TestBed.inject(Router).serializeUrl(result as UrlTree)).toBe('/acceso?returnUrl=%2Fadmin%2Fclientes%3Fbuscar%3DAna');
  });
  it('allows the current session through', () => {
    auth.eslogueado.mockReturnValue(true);
    expect(TestBed.inject(LogingGuard).canActivate({} as ActivatedRouteSnapshot, { url: '/admin/pedidos' } as RouterStateSnapshot)).toBe(true);
  });
});
