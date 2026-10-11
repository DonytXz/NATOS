import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CATALOG_PRODUCTS } from '../../catalogo/catalog.data';
import { CartitemComponent } from './cartitem.component';

describe('CartitemComponent', () => {
  let component: CartitemComponent;
  let fixture: ComponentFixture<CartitemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [CartitemComponent] }).compileComponents();
    fixture = TestBed.createComponent(CartitemComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('item', { product: CATALOG_PRODUCTS[0], quantity: 1, status: 'ready' });
    fixture.detectChanges();
  });

  it('emits a numeric quantity with an accessible inline validation error', () => {
    const emit = vi.spyOn(component.quantityChanged, 'emit');
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input[type="number"]');
    input.value = '1.5';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(emit).toHaveBeenCalledWith({ id: 1, quantity: 1.5 });
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(fixture.nativeElement.textContent).toContain('número entero');
  });

  it('does not allow an unknown outcome to be retried without explicit verification', () => {
    fixture.componentRef.setInput('item', { product: CATALOG_PRODUCTS[0], quantity: 1, status: 'unknown' });
    fixture.detectChanges();
    const emit = vi.spyOn(component.outcomeVerified, 'emit');
    component.confirmOutcome();
    expect(emit).not.toHaveBeenCalled();
    component.verification = 'not-received';
    component.confirmOutcome();
    expect(emit).toHaveBeenCalledWith(1);
    expect(component.verification).toBe('');
  });

  it('allows confirmed receipt to be recorded without enabling another send', () => {
    const receipt = vi.spyOn(component.receiptVerified, 'emit');
    const retry = vi.spyOn(component.outcomeVerified, 'emit');
    component.verification = 'received';
    component.confirmOutcome();
    expect(receipt).toHaveBeenCalledWith(1);
    expect(retry).not.toHaveBeenCalled();
  });
});
