import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { RegistrarComponent } from './registrar.component';
import { environment } from '../../environments/environment';

describe('RegistrarComponent', () => {
  let component: RegistrarComponent;
  let fixture: ComponentFixture<RegistrarComponent>;
  let http: HttpTestingController;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])]
    }).compileComponents();
    fixture = TestBed.createComponent(RegistrarComponent);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });
  afterEach(() => http.verify());

  it('requires all registration fields and hides the password by default', () => {
    component.insertar();
    http.expectNone(environment.apiUrl + '/user/registrar');
    expect(fixture.nativeElement.querySelector('#register-password').type).toBe('password');
    expect(component.form.invalid).toBe(true);
  });

  it('preserves registration contract and prevents duplicate pending submissions', () => {
    component.form.setValue({ codigo: ' code ', username: ' personal ', password: 'secret' });
    component.insertar();
    component.insertar();
    const request = http.expectOne(environment.apiUrl + '/user/registrar');
    expect(request.request.body).toEqual({ codigo: 'code', username: 'personal', password: 'secret' });
    request.flush({});
    expect(component.success()).toBe(true);
    expect(component.pending()).toBe(false);
    expect(component.form.controls.password.value).toBe('');
  });

  it('retains the draft and shows failures instead of claiming success', () => {
    const draft = { codigo: 'code', username: 'personal', password: 'secret' };
    component.form.setValue(draft);
    component.insertar();
    http.expectOne(environment.apiUrl + '/user/registrar').flush({}, { status: 400, statusText: 'Bad request' });
    fixture.detectChanges();
    expect(component.form.getRawValue()).toEqual(draft);
    expect(component.success()).toBe(false);
    expect(component.pending()).toBe(false);
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain('No se pudo completar el registro');
  });
});
