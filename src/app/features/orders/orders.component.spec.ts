import { TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { of, Subject, throwError } from 'rxjs';
import { PedidoService } from '../../servicios/pedido.service';
import { OrdersComponent } from './orders.component';

@Component({
  standalone: true,
  imports: [OrdersComponent],
  template: '<app-orders />',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class OnPushOrdersHost {}

describe('OrdersComponent', () => {
  const orders = [
    { id: 1, name: 'Tarima de pino', quantity: 2, price: 1200, status: 'En proceso', correo: 'ana@example.com' },
    { id: 2, name: 'Tarima de plástico', quantity: 3, price: 1500, status: 'Entregado', correo: 'luis@example.com' },
  ];
  let service: { consultarTodoPedido: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    service = { consultarTodoPedido: vi.fn(() => of(orders)) };
    await TestBed.configureTestingModule({
      imports: [OrdersComponent, OnPushOrdersHost],
      providers: [{ provide: PedidoService, useValue: service }],
    }).compileComponents();
  });

  it('reads existing order records and filters by the returned status and contact', () => {
    const fixture = TestBed.createComponent(OrdersComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance;
    expect(service.consultarTodoPedido).toHaveBeenCalledOnce();
    expect(component.statuses).toEqual(['En proceso', 'Entregado']);
    component.status = 'En proceso';
    component.query = 'ana@';
    fixture.detectChanges();
    expect(component.visibleOrders).toEqual([orders[0]]);
    expect(fixture.nativeElement.querySelectorAll('tbody tr').length).toBe(1);
    expect(fixture.nativeElement.textContent).toContain('ana@example.com');
    expect(fixture.nativeElement.textContent).not.toContain('luis@example.com');
  });

  it('shows a failure and permits retry without inventing successful results', () => {
    service.consultarTodoPedido.mockReturnValueOnce(throwError(() => new Error('offline')));
    const fixture = TestBed.createComponent(OrdersComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain('No pudimos cargar');
    expect(fixture.componentInstance.orders).toEqual([]);
    fixture.componentInstance.load();
    fixture.detectChanges();
    expect(fixture.componentInstance.error).toBe('');
    expect(fixture.nativeElement.querySelectorAll('tbody tr').length).toBe(2);
  });

  it('does not issue duplicate reads while a refresh is pending', () => {
    const response = new Subject<typeof orders>();
    service.consultarTodoPedido.mockReturnValue(response);
    const fixture = TestBed.createComponent(OrdersComponent);
    fixture.detectChanges();
    fixture.componentInstance.load();
    expect(service.consultarTodoPedido).toHaveBeenCalledOnce();
    response.next(orders);
    response.complete();
    expect(fixture.componentInstance.loading).toBe(false);
  });

  it('renders delayed success and error responses beneath a clean OnPush parent', async () => {
    const response = new Subject<typeof orders>();
    service.consultarTodoPedido.mockReturnValueOnce(response);
    const host = TestBed.createComponent(OnPushOrdersHost);
    host.autoDetectChanges();
    await host.whenStable();
    expect(host.nativeElement.textContent).toContain('Cargando pedidos');

    response.next(orders);
    response.complete();
    await host.whenStable();
    expect(host.nativeElement.textContent).not.toContain('Cargando pedidos');
    expect(host.nativeElement.querySelectorAll('tbody tr').length).toBe(2);

    const failure = new Subject<typeof orders>();
    service.consultarTodoPedido.mockReturnValueOnce(failure);
    host.nativeElement.querySelector('.orders-heading button').click();
    await host.whenStable();
    expect(host.nativeElement.querySelector('.orders-heading button').disabled).toBe(true);
    failure.error(new Error('offline'));
    await host.whenStable();
    expect(host.nativeElement.querySelector('.orders-heading button').disabled).toBe(false);
    expect(host.nativeElement.querySelector('[role="alert"]').textContent).toContain('No pudimos cargar');
  });
});
