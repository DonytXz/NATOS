import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { LoginService, safeReturnUrl, sessionInterceptor } from './login.service';
import { environment } from '../../environments/environment';

describe('LoginService', () => {
  let service: LoginService;
  let http: HttpTestingController;
  let router: { url: string; navigate: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    localStorage.clear();
    router = { url: '/admin/clientes', navigate: vi.fn().mockResolvedValue(true) };
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptors([sessionInterceptor])), provideHttpClientTesting(), { provide: Router, useValue: router }]
    });
    service = TestBed.inject(LoginService);
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => { http.verify(); localStorage.clear(); });

  it('leaves staff routes when another tab removes the session', () => {
    service.setSession({ jwtoken: 'test-session' });
    localStorage.removeItem('token');
    window.dispatchEvent(new StorageEvent('storage', { key: 'token', newValue: null }));
    expect(service.loggedIn()).toBe(false);
    expect(service.eslogueado()).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/acceso'], { queryParams: { returnUrl: '/admin/clientes', sesion: 'expirada' } });
  });

  it('synchronizes a session created in another tab', () => {
    window.dispatchEvent(new StorageEvent('storage', { key: 'token', newValue: 'other-tab-session' }));
    expect(service.loggedIn()).toBe(true);
    expect(service.eslogueado()).toBe(true);
  });

  it('preserves the login endpoint/payload and stores only a validated jwtoken response', () => {
    const credentials = { username: 'personal', password: 'secret' };
    service.login(credentials).subscribe();
    const request = http.expectOne(environment.apiUrl + '/user/login');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(credentials);
    request.flush({ jwtoken: 'existing-opaque-token' });
    expect(service.loggedIn()).toBe(true);
    expect(localStorage.getItem('token')).toBe('existing-opaque-token');
  });

  it.each([{}, null, { jwtoken: '' }, { jwtoken: 'undefined' }, { jwtoken: 123 }])('rejects a malformed login response: %j', response => {
    const onError = vi.fn();
    service.login({ username: 'personal', password: 'secret' }).subscribe({ error: onError });
    http.expectOne(environment.apiUrl + '/user/login').flush(response);
    expect(onError).toHaveBeenCalled();
    expect(service.eslogueado()).toBe(false);
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('rejects an expired JWT when an expiry is supplied', () => {
    const token = 'header.' + btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) - 60 })) + '.signature';
    expect(() => service.setSession({ jwtoken: token })).toThrow();
    expect(service.loggedIn()).toBe(false);
  });

  it('removes session state and navigates away from staff screens on logout', () => {
    service.setSession({ jwtoken: 'existing-token' });
    service.logout();
    expect(service.loggedIn()).toBe(false);
    expect(localStorage.getItem('token')).toBeNull();
    expect(router.navigate).toHaveBeenCalledWith(['/acceso']);
  });

  it('invalidates the session on an API 401 without adding an authentication header', () => {
    service.setSession({ jwtoken: 'existing-token' });
    TestBed.inject(HttpClient).get(environment.apiUrl + '/clientes/consultar').subscribe({ error: () => {} });
    const request = http.expectOne(environment.apiUrl + '/clientes/consultar');
    expect(request.request.headers.has('Authorization')).toBe(false);
    request.flush({}, { status: 401, statusText: 'Unauthorized' });
    expect(service.loggedIn()).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/acceso'], { queryParams: { returnUrl: '/admin/clientes', sesion: 'expirada' } });
  });

  it('does not let a third-party 401 log the user out', () => {
    service.setSession({ jwtoken: 'existing-token' });
    TestBed.inject(HttpClient).get('https://external.example/data').subscribe({ error: () => {} });
    http.expectOne('https://external.example/data').flush({}, { status: 401, statusText: 'Unauthorized' });
    expect(service.loggedIn()).toBe(true);
    expect(router.navigate).not.toHaveBeenCalled();
  });
});

describe('safeReturnUrl', () => {
  it('retains the requested internal path and query', () => {
    expect(safeReturnUrl('/admin/clientes?buscar=Ana')).toBe('/admin/clientes?buscar=Ana');
  });
  it.each(['https://external.example', '//external.example', '/%2Fexternal.example', '/\\external.example', '/acceso?returnUrl=/acceso', '/Iniciar', null])('rejects unsafe paths and auth loops: %s', value => {
    expect(safeReturnUrl(value)).toBe('/admin/pedidos');
  });
});
