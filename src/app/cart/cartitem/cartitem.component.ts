import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CartLine, MAX_CART_QUANTITY, validQuantity } from '../../core/cart-state.service';
import { formatMxn } from '../../catalogo/catalog.data';

@Component({
  selector: 'app-cartitem',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './cartitem.component.html',
  styleUrls: ['./cartitem.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartitemComponent implements OnChanges {
  @Input({ required: true }) item!: CartLine;
  @Input() disabled = false;
  @Output() quantityChanged = new EventEmitter<{ id: number; quantity: number }>();
  @Output() removed = new EventEmitter<number>();
  @Output() outcomeVerified = new EventEmitter<number>();
  @Output() receiptVerified = new EventEmitter<number>();
  readonly money = formatMxn;
  readonly maxQuantity = MAX_CART_QUANTITY;
  invalidQuantity = false;
  verification = '';

  ngOnChanges(changes: SimpleChanges): void {
    const previous: CartLine | undefined = changes['item']?.previousValue;
    if (previous && (previous.quantity !== this.item.quantity || previous.status !== this.item.status)) {
      this.invalidQuantity = false;
      this.verification = '';
    }
  }

  changeQuantity(event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);
    this.invalidQuantity = !validQuantity(value);
    this.quantityChanged.emit({ id: this.item.product.id, quantity: value });
  }

  confirmOutcome(): void {
    if (this.disabled) return;
    if (this.verification === 'not-received') this.outcomeVerified.emit(this.item.product.id);
    if (this.verification === 'received') this.receiptVerified.emit(this.item.product.id);
    this.verification = '';
  }
}
