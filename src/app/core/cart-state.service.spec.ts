import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject, of, throwError } from 'rxjs';
import { CATALOG_PRODUCTS } from '../catalogo/catalog.data';
import { PedidoService } from '../servicios/pedido.service';
import { CART_STORAGE_KEY, CartStateService, MAX_CART_QUANTITY } from './cart-state.service';

describe('CartStateService', () => {
  let service: CartStateService;
  let orders: { insertarPedido: ReturnType<typeof vi.fn>; consultarTodoPedido: ReturnType<typeof vi.fn> };
  const originalLocks = Object.getOwnPropertyDescriptor(navigator, 'locks');

  beforeEach(() => {
    localStorage.removeItem(CART_STORAGE_KEY);
    orders = { insertarPedido: vi.fn().mockReturnValue(of({})), consultarTodoPedido: vi.fn() };
    TestBed.configureTestingModule({ providers: [{ provide: PedidoService, useValue: orders }] });
    service = TestBed.inject(CartStateService);
  });
  afterEach(() => {
    vi.restoreAllMocks();
    if (originalLocks) Object.defineProperty(navigator, 'locks', originalLocks);
    else delete (navigator as { locks?: LockManager }).locks;
    localStorage.removeItem(CART_STORAGE_KEY);
  });

  it('keeps additions, quantities, removal and derived totals consistent', () => {
    service.add(1);
    service.add(1);
    service.add(2);
    expect(service.count()).toBe(3);
    expect(service.total()).toBe(3960 * 2 + 17500);
    service.remove(999);
    expect(service.items()).toHaveLength(2);
    service.setQuantity(1, 3);
    service.remove(2);
    expect(service.count()).toBe(3);
    expect(service.total()).toBe(3960 * 3);
  });

  it('rejects fractional, zero, negative and excessive quantities without mutating selections', () => {
    service.add(1);
    for (const value of [0, -1, 1.5, NaN, Infinity, MAX_CART_QUANTITY + 1]) {
      expect(service.setQuantity(1, value)).toBe(false);
    }
    expect(service.items()[0].quantity).toBe(1);
    expect(service.add(999)).toBe(false);
  });

  it('does not request operational records during storefront use', () => {
    service.add(1);
    service.setQuantity(1, 3);
    expect(orders.consultarTodoPedido).not.toHaveBeenCalled();
    expect(orders.insertarPedido).not.toHaveBeenCalled();
  });

  it('submits current quantities and the unchanged legacy payload fields', async () => {
    service.add(1);
    service.setQuantity(1, 3);
    await service.submit('  buyer@example.com  ');
    expect(orders.insertarPedido).toHaveBeenCalledExactlyOnceWith({
      id: 1, name: CATALOG_PRODUCTS[0].apiName, quantity: 3,
      price: 3960, status: 'En proceso', correo: 'buyer@example.com',
    });
    expect(service.items()[0].status).toBe('succeeded');
    expect(service.count()).toBe(0);
    expect(localStorage.getItem(CART_STORAGE_KEY)).not.toContain('buyer');
    expect(localStorage.getItem(CART_STORAGE_KEY)).not.toContain('correo');
  });

  it('does not send invalid email or an empty cart', async () => {
    await service.submit('buyer@example.com');
    service.add(1);
    for (const email of ['', 'buyer', 'buyer@', 'buyer@example', 'a b@example.com']) await service.submit(email);
    expect(orders.insertarPedido).not.toHaveBeenCalled();
  });

  it('locks mutations and suppresses duplicate pending submissions', async () => {
    const response = new Subject<unknown>();
    orders.insertarPedido.mockReturnValue(response);
    service.add(1);
    const first = service.submit('buyer@example.com');
    expect(service.isSubmitting()).toBe(true);
    expect(service.items()[0].status).toBe('pending');
    expect(service.add(2)).toBe(false);
    expect(service.setQuantity(1, 5)).toBe(false);
    service.remove(1);
    await service.submit('buyer@example.com');
    expect(orders.insertarPedido).toHaveBeenCalledTimes(1);
    expect(service.items()).toHaveLength(1);
    response.next({});
    response.complete();
    await first;
    expect(service.isSubmitting()).toBe(false);
  });

  it('preserves mixed outcomes and retries only rejected lines on an explicit next submit', async () => {
    service.add(1);
    service.add(2);
    service.add(3);
    orders.insertarPedido.mockReturnValueOnce(of({}))
      .mockReturnValueOnce(throwError(() => new HttpErrorResponse({ status: 400 })))
      .mockReturnValueOnce(throwError(() => new HttpErrorResponse({ status: 0 })));
    await service.submit('buyer@example.com');
    expect(service.items().map(item => item.status)).toEqual(['succeeded', 'failed', 'unknown']);
    expect(service.add(1)).toBe(false);
    expect(service.setQuantity(3, 5)).toBe(false);
    await service.submit('buyer@example.com');
    expect(orders.insertarPedido).toHaveBeenCalledTimes(4);
    expect(orders.insertarPedido.mock.calls[3][0].id).toBe(2);
    expect(service.items().map(item => item.status)).toEqual(['succeeded', 'succeeded', 'unknown']);
  });

  it('treats server failures, timeouts and unexpected conflicts as unknown, never automatically retrying', async () => {
    service.add(1);
    service.add(2);
    service.add(3);
    orders.insertarPedido.mockReturnValueOnce(throwError(() => new HttpErrorResponse({ status: 500 })))
      .mockReturnValueOnce(throwError(() => new HttpErrorResponse({ status: 408 })))
      .mockReturnValueOnce(throwError(() => new HttpErrorResponse({ status: 409 })));
    await service.submit('buyer@example.com');
    expect(service.items().every(item => item.status === 'unknown')).toBe(true);
    await service.submit('buyer@example.com');
    expect(orders.insertarPedido).toHaveBeenCalledTimes(3);
  });

  it('requires an explicit verification action before unknown lines can be submitted again', async () => {
    service.add(1);
    orders.insertarPedido.mockReturnValueOnce(throwError(() => new HttpErrorResponse({ status: 0 })));
    await service.submit('buyer@example.com');
    service.acknowledgeNotReceived(1);
    expect(service.items()[0].status).toBe('ready');
    await service.submit('buyer@example.com');
    expect(orders.insertarPedido).toHaveBeenCalledTimes(2);
  });

  it('restores interrupted submissions as unknown and does not resend completed lines', async () => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify([
      { id: 1, quantity: 3, status: 'pending' },
      { id: 2, quantity: 2, status: 'succeeded' },
    ]));
    const restored = TestBed.runInInjectionContext(() => new CartStateService());
    expect(restored.items().map(item => item.status)).toEqual(['unknown', 'succeeded']);
    await restored.submit('buyer@example.com');
    expect(orders.insertarPedido).not.toHaveBeenCalled();
    restored.acknowledgeReceived(1);
    await restored.submit('buyer@example.com');
    expect(restored.items().map(item => item.status)).toEqual(['succeeded', 'succeeded']);
    expect(orders.insertarPedido).not.toHaveBeenCalled();
  });

  it('validates persisted selections and gets prices from the catalog, not storage', () => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify([
      { id: 1, quantity: 3, price: 1, name: 'changed', correo: 'leaked@example.com' },
      { id: 1, quantity: 4 }, { id: 2, quantity: -1 }, { id: 3, quantity: '2' },
      { id: 999, quantity: 1 }, null,
    ]));
    const restored = TestBed.runInInjectionContext(() => new CartStateService());
    expect(restored.items()).toHaveLength(1);
    expect(restored.items()[0].product).toEqual(CATALOG_PRODUCTS[0]);
    expect(restored.total()).toBe(11880);
    restored.setQuantity(1, 2);
    expect(JSON.parse(localStorage.getItem(CART_STORAGE_KEY)!)).toEqual([{ id: 1, quantity: 2, status: 'ready' }]);
  });

  it('recovers from malformed storage and remains usable when writes are unavailable', () => {
    localStorage.setItem(CART_STORAGE_KEY, '{invalid json');
    const restored = TestBed.runInInjectionContext(() => new CartStateService());
    expect(restored.items()).toEqual([]);
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('quota'); });
    expect(restored.add(1)).toBe(true);
    expect(restored.count()).toBe(1);
    expect(restored.storageWarning()).toContain('no permite guardar');
    expect(restored.add(2)).toBe(true);
    expect(restored.setQuantity(1, 3)).toBe(true);
    expect(restored.items().map(item => item.quantity)).toEqual([3, 1]);
  });

  it('reflects another tab immediately and reads current storage instead of stale event payloads', () => {
    service.add(1);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify([
      { id: 1, quantity: 2, status: 'succeeded' }, { id: 2, quantity: 3, status: 'ready' },
    ]));
    window.dispatchEvent(new StorageEvent('storage', { key: CART_STORAGE_KEY, newValue: '[]', storageArea: localStorage }));
    expect(service.items().map(item => [item.product.id, item.quantity, item.status])).toEqual([
      [1, 2, 'succeeded'], [2, 3, 'ready'],
    ]);
    expect(service.count()).toBe(3);
    localStorage.clear();
    window.dispatchEvent(new StorageEvent('storage', { key: null, storageArea: localStorage }));
    expect(service.items()).toEqual([]);
  });

  it('refreshes before edits so stale tabs cannot overwrite outcomes or other additions', async () => {
    service.add(1);
    const otherTab = TestBed.runInInjectionContext(() => new CartStateService());
    await otherTab.submit('buyer@example.com');
    otherTab.add(2);
    expect(service.add(1)).toBe(false);
    expect(service.setQuantity(1, 7)).toBe(false);
    service.acknowledgeNotReceived(1);
    expect(service.add(3)).toBe(true);
    expect(service.items().map(item => [item.product.id, item.status])).toEqual([
      [1, 'succeeded'], [2, 'ready'], [3, 'ready'],
    ]);
    await service.submit('buyer@example.com');
    expect(orders.insertarPedido.mock.calls.map(call => call[0].id)).toEqual([1, 2, 3]);
  });

  it('preserves additions made in another tab while an order response is pending', async () => {
    const response = new Subject<unknown>();
    orders.insertarPedido.mockReturnValueOnce(response);
    service.add(1);
    const otherTab = TestBed.runInInjectionContext(() => new CartStateService());
    const submission = service.submit('buyer@example.com');
    otherTab.add(2);
    otherTab.remove(1);
    expect(otherTab.items()[0].status).toBe('unknown');
    window.dispatchEvent(new StorageEvent('storage', { key: CART_STORAGE_KEY, storageArea: localStorage }));
    expect(service.items()[0].status).toBe('pending');
    response.next({});
    response.complete();
    await submission;
    expect(service.items().map(item => [item.product.id, item.status])).toEqual([[1, 'succeeded'], [2, 'ready']]);
    expect(JSON.parse(localStorage.getItem(CART_STORAGE_KEY)!)).toEqual([
      { id: 1, quantity: 1, status: 'succeeded' }, { id: 2, quantity: 1, status: 'ready' },
    ]);
    expect(orders.insertarPedido).toHaveBeenCalledTimes(1);
  });

  it('uses one browser-wide lock and drops a simultaneous submit from another tab', async () => {
    let held = false;
    const request = vi.fn(async (_name: string, options: LockOptions, callback: LockGrantedCallback<unknown>) => {
      expect(options.ifAvailable).toBe(true);
      if (held) return callback(null);
      held = true;
      try { return await callback({ name: 'natos.cart.submit.v2', mode: 'exclusive' }); }
      finally { held = false; }
    });
    Object.defineProperty(navigator, 'locks', { configurable: true, value: { request } });
    const response = new Subject<unknown>();
    orders.insertarPedido.mockReturnValueOnce(response);
    service.add(1);
    const otherTab = TestBed.runInInjectionContext(() => new CartStateService());
    const first = service.submit('buyer@example.com');
    otherTab.add(2);
    await otherTab.submit('buyer@example.com');
    expect(orders.insertarPedido).toHaveBeenCalledTimes(1);
    expect(otherTab.items()[0].status).toBe('unknown');
    response.next({});
    response.complete();
    await first;
    expect(orders.insertarPedido).toHaveBeenCalledTimes(1);
    await otherTab.submit('buyer@example.com');
    expect(orders.insertarPedido.mock.calls.map(call => call[0].id)).toEqual([1, 2]);
    expect(otherTab.items().map(item => item.status)).toEqual(['succeeded', 'succeeded']);
    expect(request).toHaveBeenCalledTimes(3);
  });
});
