import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ShopComponent } from './shop.component';

describe('ShopComponent', () => {
  it('keeps compatibility navigation available', async () => {
    await TestBed.configureTestingModule({ imports: [ShopComponent], providers: [provideRouter([])] }).compileComponents();
    const fixture = TestBed.createComponent(ShopComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('a').getAttribute('href')).toBe('/catalogo');
  });
});
