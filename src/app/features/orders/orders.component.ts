import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { PedidoService } from '../../servicios/pedido.service';

interface OrderRecord {
  id: string | number;
  name: string;
  quantity: string | number;
  price: string | number;
  status: string;
  correo: string;
}

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class OrdersComponent implements OnInit {
  private readonly service = inject(PedidoService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly changeDetector = inject(ChangeDetectorRef);
  private readonly currency = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' });

  orders: OrderRecord[] = [];
  loading = false;
  error = '';
  query = '';
  status = '';
  page = 1;
  readonly pageSize = 15;

  ngOnInit(): void { this.load(); }

  get statuses(): string[] {
    return [...new Set(this.orders.map(order => order.status).filter(Boolean))].sort();
  }

  get filteredOrders(): OrderRecord[] {
    const term = this.query.trim().toLocaleLowerCase('es-MX');
    return this.orders.filter(order => (!this.status || order.status === this.status) &&
      (!term || [order.id, order.name, order.correo, order.status].some(value =>
        String(value ?? '').toLocaleLowerCase('es-MX').includes(term))));
  }

  get pageCount(): number { return Math.max(1, Math.ceil(this.filteredOrders.length / this.pageSize)); }
  get visibleOrders(): OrderRecord[] {
    return this.filteredOrders.slice((this.page - 1) * this.pageSize, this.page * this.pageSize);
  }

  load(): void {
    if (this.loading) return;
    this.loading = true;
    this.error = '';
    this.changeDetector.markForCheck();
    this.service.consultarTodoPedido().pipe(takeUntilDestroyed(this.destroyRef), finalize(() => {
      this.loading = false;
      this.changeDetector.markForCheck();
    })).subscribe({
      next: orders => {
        if (!Array.isArray(orders)) {
          this.error = 'No pudimos leer los pedidos recibidos. Intenta actualizar la lista.';
          this.changeDetector.markForCheck();
          return;
        }
        this.orders = orders;
        if (this.status && !this.statuses.includes(this.status)) this.status = '';
        this.page = Math.min(this.page, this.pageCount);
        this.changeDetector.markForCheck();
      },
      error: () => {
        this.error = 'No pudimos cargar los pedidos. Revisa tu conexión o vuelve a iniciar sesión e inténtalo de nuevo.';
        this.changeDetector.markForCheck();
      },
    });
  }

  price(value: string | number): string {
    return value !== '' && value !== null && value !== undefined && Number.isFinite(Number(value)) ? this.currency.format(Number(value)) : '—';
  }

  clearFilters(): void { this.query = ''; this.status = ''; this.page = 1; }
}
