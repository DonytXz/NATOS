import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { SugerenciasComponent } from './sugerencias.component';
import { LoginService } from '../servicios/login.service';

describe('SugerenciasComponent', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());
  it('loads the response sheet only when a staff session is present', async () => {
    await TestBed.configureTestingModule({
      imports: [SugerenciasComponent], providers: [provideHttpClient(), provideRouter([])]
    }).compileComponents();
    const fixture = TestBed.createComponent(SugerenciasComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('iframe').length).toBe(1);
    TestBed.inject(LoginService).setSession({ jwtoken: 'existing-token' });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('iframe').length).toBe(2);
  });
});
