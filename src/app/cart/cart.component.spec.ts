import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { CartComponent } from './cart.component';
import { CART_STORAGE_KEY, CartStateService } from '../core/cart-state.service';
import { PedidoService } from '../servicios/pedido.service';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let cart: CartStateService;
  let orders: { insertarPedido: ReturnType<typeof vi.fn>; consultarTodoPedido: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    localStorage.removeItem(CART_STORAGE_KEY);
    orders = { insertarPedido: vi.fn().mockReturnValue(of({})), consultarTodoPedido: vi.fn() };
    await TestBed.configureTestingModule({
      imports: [CartComponent], providers: [provideRouter([]), { provide: PedidoService, useValue: orders }],
    }).compileComponents();
    cart = TestBed.inject(CartStateService);
    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  afterEach(() => { localStorage.removeItem(CART_STORAGE_KEY); vi.restoreAllMocks(); });

  it('shows the empty state without loading private orders', () => {
    expect(fixture.nativeElement.textContent).toContain('Tu próximo pedido comienza aquí');
    expect(orders.consultarTodoPedido).not.toHaveBeenCalled();
  });

  it('blocks submission when a visible quantity field is invalid instead of sending its previous value', async () => {
    cart.add(1);
    component.email.set('buyer@example.com');
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input[type="number"]');
    input.value = '0';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await component.submit();
    expect(orders.insertarPedido).not.toHaveBeenCalled();
    expect(component.error()).toContain('cantidades');
    expect(fixture.nativeElement.querySelector('button[type="submit"]').disabled).toBe(true);
    input.value = '3';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await component.submit();
    expect(orders.insertarPedido.mock.calls[0][0].quantity).toBe(3);
  });

  it('keeps a single contact email form and preserves input on invalid submission', async () => {
    cart.add(1);
    cart.add(2);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('input[type="email"]')).toHaveLength(1);
    component.email.set('invalid');
    await component.submit();
    expect(component.error()).toContain('correo electrónico válido');
    expect(component.email()).toBe('invalid');
    expect(orders.insertarPedido).not.toHaveBeenCalled();
  });

  it('clears obsolete quantity errors when another tab changes or removes that line', async () => {
    cart.add(1);
    cart.add(2);
    component.email.set('buyer@example.com');
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input[type="number"]');
    input.value = '0';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.invalidIds()).toEqual([1]);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify([{ id: 1, quantity: 3 }, { id: 2, quantity: 1 }]));
    window.dispatchEvent(new StorageEvent('storage', { key: CART_STORAGE_KEY }));
    fixture.detectChanges();
    expect(input.value).toBe('3');
    expect(input.getAttribute('aria-invalid')).toBe('false');
    expect(component.invalidIds()).toEqual([]);
    input.value = '0';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify([{ id: 2, quantity: 1 }]));
    window.dispatchEvent(new StorageEvent('storage', { key: CART_STORAGE_KEY }));
    fixture.detectChanges();
    expect(component.invalidIds()).toEqual([]);
    await component.submit();
    expect(orders.insertarPedido.mock.calls.map(call => call[0].id)).toEqual([2]);
  });

  it('prints without replacing the application DOM or clearing the cart', () => {
    cart.add(1);
    fixture.detectChanges();
    const before = fixture.nativeElement.innerHTML;
    const print = vi.spyOn(window, 'print').mockImplementation(() => {});
    component.print();
    expect(print).toHaveBeenCalledTimes(1);
    expect(fixture.nativeElement.innerHTML).toBe(before);
    expect(cart.count()).toBe(1);
  });
});
