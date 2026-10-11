import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { InicioComponent } from './inicio.component';
describe('Inicio', () => {
  it('offers a direct catalog entry and static product imagery', async () => {
    await TestBed.configureTestingModule({ imports: [InicioComponent], providers: [provideRouter([])] }).compileComponents();
    const fixture = TestBed.createComponent(InicioComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('a[href="/catalogo"]')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('img[fetchpriority="high"]').getAttribute('src')).toContain('.webp');
  });
});
