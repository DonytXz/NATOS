import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, Router, convertToParamMap, provideRouter } from '@angular/router';
import { IniciarComponent } from './iniciar.component';
import { environment } from '../../environments/environment';

describe('IniciarComponent', () => {
  let component: IniciarComponent;
  let fixture: ComponentFixture<IniciarComponent>;
  let http: HttpTestingController;
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [IniciarComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: convertToParamMap({ returnUrl: '/admin/clientes' }) } } }]
    }).compileComponents();
    fixture = TestBed.createComponent(IniciarComponent);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });
  afterEach(() => { http.verify(); localStorage.clear(); });

  it('does not submit invalid credentials and associates visible validation with its fields', () => {
    component.login();
    fixture.detectChanges();
    http.expectNone(environment.apiUrl + '/user/login');
    expect(fixture.nativeElement.querySelector('#login-username').getAttribute('aria-invalid')).toBe('true');
    expect(fixture.nativeElement.textContent).toContain('Escribe tu nombre de usuario.');
  });

  it('submits once while pending and returns to the protected route after success', () => {
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);
    component.form.setValue({ username: ' personal ', password: 'secret' });
    component.login();
    component.login();
    const request = http.expectOne(environment.apiUrl + '/user/login');
    expect(request.request.body).toEqual({ username: 'personal', password: 'secret' });
    expect(component.pending()).toBe(true);
    request.flush({ jwtoken: 'existing-token' });
    expect(component.pending()).toBe(false);
    expect(navigate).toHaveBeenCalledWith('/admin/clientes');
    expect(component.form.controls.password.value).toBe('');
  });

  it('keeps credentials available and displays an accessible error after failure', () => {
    component.form.setValue({ username: 'personal', password: 'secret' });
    component.login();
    http.expectOne(environment.apiUrl + '/user/login').flush({}, { status: 401, statusText: 'Unauthorized' });
    fixture.detectChanges();
    expect(component.pending()).toBe(false);
    expect(component.form.controls.username.value).toBe('personal');
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain('Revisa tu usuario y contraseña');
  });

  it('starts with a protected password and provides a keyboard-operable toggle', () => {
    expect(fixture.nativeElement.querySelector('#login-password').type).toBe('password');
    fixture.nativeElement.querySelector('.password-toggle').click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#login-password').type).toBe('text');
  });
});
