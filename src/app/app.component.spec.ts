import { TestBed } from '@angular/core/testing';
import { provideRouter, RouterOutlet } from '@angular/router';
import { AppComponent } from './app.component';
describe('Application shell', () => {
  it('provides a skip link and routing outlet', async () => {
    await TestBed.configureTestingModule({ declarations: [AppComponent], imports: [RouterOutlet], providers: [provideRouter([])] }).compileComponents();
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.skip-link').textContent).toContain('Saltar al contenido');
    expect(fixture.nativeElement.querySelector('router-outlet')).not.toBeNull();
  });
});
