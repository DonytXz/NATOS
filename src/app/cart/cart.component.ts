import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CartStateService, validOrderEmail, validQuantity } from '../core/cart-state.service';
import { formatMxn } from '../catalogo/catalog.data';
import { CartitemComponent } from './cartitem/cartitem.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [FormsModule, RouterLink, CartitemComponent],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartComponent {
  readonly cart = inject(CartStateService);
  readonly money = formatMxn;
  readonly email = signal('');
  readonly error = signal('');
  private readonly invalidQuantities = signal<Record<number, number>>({});
  readonly invalidIds = computed(() => this.cart.items().filter(item =>
    this.cart.canEdit(item) && this.invalidQuantities()[item.product.id] === item.quantity
  ).map(item => item.product.id));
  readonly results = computed(() => this.cart.items().filter(item => item.status === 'succeeded' || item.status === 'failed' || item.status === 'unknown'));
  readonly sentCount = computed(() => this.cart.items().filter(item => item.status === 'succeeded').length);
  readonly sendTotal = computed(() => this.cart.items().filter(item => this.cart.canEdit(item)).reduce((sum, item) => sum + item.quantity * item.product.price, 0));
  readonly unknownCount = computed(() => this.cart.items().filter(item => item.status === 'unknown').length);

  constructor() {
    effect(() => {
      const active = new Set(this.invalidIds());
      const saved = this.invalidQuantities();
      if (Object.keys(saved).some(id => !active.has(Number(id)))) {
        this.invalidQuantities.set(Object.fromEntries(Object.entries(saved).filter(([id]) => active.has(Number(id)))));
      }
    });
  }

  changeQuantity(change: { id: number; quantity: number }): void {
    const otherQuantities = { ...this.invalidQuantities() };
    delete otherQuantities[change.id];
    if (!validQuantity(change.quantity)) {
      const item = this.cart.items().find(item => item.product.id === change.id);
      this.invalidQuantities.set(item ? { ...otherQuantities, [change.id]: item.quantity } : otherQuantities);
      return;
    }
    this.invalidQuantities.set(otherQuantities);
    this.cart.setQuantity(change.id, change.quantity);
    this.error.set('');
  }

  remove(id: number): void {
    this.cart.remove(id);
    this.invalidQuantities.update(values => {
      const remaining = { ...values };
      delete remaining[id];
      return remaining;
    });
  }

  async submit(): Promise<void> {
    if (this.cart.isSubmitting()) return;
    if (this.invalidIds().length) {
      this.error.set('Revisa las cantidades marcadas antes de enviar.');
      return;
    }
    if (!validOrderEmail(this.email().trim())) {
      this.error.set('Introduce un correo electrónico válido para esta solicitud.');
      return;
    }
    this.error.set('');
    await this.cart.submit(this.email());
  }

  print(): void { window.print(); }
}
