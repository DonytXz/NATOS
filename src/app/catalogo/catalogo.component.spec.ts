import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { CatalogoComponent } from './catalogo.component';
import { CATALOG_PRODUCTS } from './catalog.data';
import { CART_STORAGE_KEY } from '../core/cart-state.service';
import { PedidoService } from '../servicios/pedido.service';

describe('CatalogoComponent', () => {
  let component: CatalogoComponent;
  let fixture: ComponentFixture<CatalogoComponent>;

  beforeEach(async () => {
    localStorage.removeItem(CART_STORAGE_KEY);
    await TestBed.configureTestingModule({
      imports: [CatalogoComponent], providers: [provideRouter([]), { provide: PedidoService, useValue: { insertarPedido: vi.fn().mockReturnValue(of({})) } }],
    }).compileComponents();
    fixture = TestBed.createComponent(CatalogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  afterEach(() => { localStorage.removeItem(CART_STORAGE_KEY); vi.restoreAllMocks(); });

  it('filters accents consistently and sorts by the existing package price', () => {
    expect(component.products()).toHaveLength(8);
    component.query.set('plastico');
    component.sort.set('price-asc');
    expect(component.products().map(product => product.id)).toEqual([3, 8, 2]);
    component.query.set('does not exist');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('No encontramos ese producto');
  });

  it('adds a package with visible feedback and no browser prompt', () => {
    const prompt = vi.spyOn(window, 'prompt');
    component.add(CATALOG_PRODUCTS[0]);
    fixture.detectChanges();
    expect(component.cart.count()).toBe(1);
    expect(component.message()).toContain('agregamos un paquete');
    expect(prompt).not.toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain('MXN / paquete');
  });
});
