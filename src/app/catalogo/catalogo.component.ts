import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CartStateService } from '../core/cart-state.service';
import { CATALOG_PRODUCTS, CatalogProduct, formatMxn } from './catalog.data';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogoComponent {
  readonly cart = inject(CartStateService);
  readonly query = signal('');
  readonly sort = signal('featured');
  readonly message = signal('');
  readonly money = formatMxn;
  readonly products = computed(() => {
    const query = this.query().trim().toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const items = CATALOG_PRODUCTS.filter(item => `${item.name} ${item.bundle} ${item.material}`.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(query));
    if (this.sort() === 'price-asc') return items.sort((a, b) => a.price - b.price);
    if (this.sort() === 'price-desc') return items.sort((a, b) => b.price - a.price);
    if (this.sort() === 'name') return items.sort((a, b) => a.name.localeCompare(b.name, 'es'));
    return items;
  });

  add(product: CatalogProduct): void {
    this.message.set(this.cart.add(product.id)
      ? `${product.name}: agregamos un paquete a tu carrito.`
      : 'Revisa este producto en tu carrito antes de agregar otro paquete.');
  }
}
