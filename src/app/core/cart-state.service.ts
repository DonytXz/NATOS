import { DestroyRef, Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom, timeout } from 'rxjs';
import { CATALOG_PRODUCTS, CatalogProduct } from '../catalogo/catalog.data';
import { PedidoService } from '../servicios/pedido.service';

export type CartStatus = 'ready' | 'pending' | 'succeeded' | 'failed' | 'unknown';
export interface CartLine {
  readonly product: CatalogProduct;
  readonly quantity: number;
  readonly status: CartStatus;
}
export const CART_STORAGE_KEY = 'natos.cart.v2';
export const MAX_CART_QUANTITY = 999;

export function validQuantity(quantity: number): boolean {
  return Number.isInteger(quantity) && quantity >= 1 && quantity <= MAX_CART_QUANTITY;
}
export function validOrderEmail(email: string): boolean {
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

@Injectable({ providedIn: 'root' })
export class CartStateService {
  private readonly orders = inject(PedidoService);
  private readonly destroyRef = inject(DestroyRef);
  // Once persistence fails, keep this tab's unsaved changes in memory until reload.
  private storageAvailable = true;
  readonly storageWarning = signal('');
  private readonly state = signal<readonly CartLine[]>(this.readStored() ?? []);
  private readonly busy = signal(false);
  readonly items = this.state.asReadonly();
  readonly isSubmitting = this.busy.asReadonly();
  readonly count = computed(() => this.items().filter(item => item.status !== 'succeeded').reduce((sum, item) => sum + item.quantity, 0));
  readonly total = computed(() => this.items().filter(item => item.status !== 'succeeded').reduce((sum, item) => sum + item.quantity * item.product.price, 0));
  readonly submitCount = computed(() => this.items().filter(item => this.canEdit(item)).length);

  constructor() {
    const sync = (event: StorageEvent) => {
      if ((event.key === CART_STORAGE_KEY || event.key === null) &&
          (!event.storageArea || event.storageArea === localStorage)) this.refresh();
    };
    window.addEventListener('storage', sync);
    this.destroyRef.onDestroy(() => window.removeEventListener('storage', sync));
  }

  canEdit(item: CartLine): boolean { return item.status === 'ready' || item.status === 'failed'; }

  add(productId: number): boolean {
    if (this.busy()) return false;
    this.refresh();
    const product = CATALOG_PRODUCTS.find(item => item.id === productId);
    if (!product) return false;
    const current = this.items().find(item => item.product.id === productId);
    if (current && (!this.canEdit(current) || !validQuantity(current.quantity + 1))) return false;
    this.update(current
      ? this.items().map(item => item === current ? { ...item, quantity: item.quantity + 1, status: 'ready' } : item)
      : [...this.items(), { product, quantity: 1, status: 'ready' }]);
    return true;
  }

  setQuantity(productId: number, quantity: number): boolean {
    if (this.busy() || !validQuantity(quantity)) return false;
    this.refresh();
    const current = this.items().find(item => item.product.id === productId);
    if (!current || !this.canEdit(current)) return false;
    this.update(this.items().map(item => item === current ? { ...item, quantity, status: 'ready' } : item));
    return true;
  }

  remove(productId: number): void {
    if (this.busy()) return;
    this.refresh();
    this.update(this.items().filter(item => item.product.id !== productId || (!this.canEdit(item) && item.status !== 'succeeded')));
  }

  acknowledgeNotReceived(productId: number): void {
    if (this.busy()) return;
    this.refresh();
    this.update(this.items().map(item => item.product.id === productId && item.status === 'unknown' ? { ...item, status: 'ready' } : item));
  }

  acknowledgeReceived(productId: number): void {
    if (this.busy()) return;
    this.refresh();
    this.update(this.items().map(item => item.product.id === productId && item.status === 'unknown' ? { ...item, status: 'succeeded' } : item));
  }

  async submit(email: string): Promise<void> {
    const address = email.trim();
    if (this.busy() || !validOrderEmail(address)) return;
    this.busy.set(true);
    try {
      // The browser holds this lock across the network calls, including across tabs.
      // Do not queue a second submit: an explicit later action can review its outcome.
      if (navigator.locks?.request) {
        await navigator.locks.request('natos.cart.submit.v2', { ifAvailable: true }, async lock => {
          if (lock) await this.submitCurrent(address);
          else this.refresh();
        });
      } else await this.submitCurrent(address);
    } finally { this.busy.set(false); }
  }

  private async submitCurrent(address: string): Promise<void> {
    this.refresh();
    const productIds = this.items().filter(item => this.canEdit(item)).map(item => item.product.id);
    for (const productId of productIds) {
      // Re-read before every request: a different tab may have changed a later line.
      this.refresh();
      const item = this.items().find(line => line.product.id === productId);
      if (!item || !this.canEdit(item) || !validQuantity(item.quantity)) continue;
      this.setStatus(item, 'pending');
      try {
        await firstValueFrom(this.orders.insertarPedido({
          id: item.product.id, name: item.product.apiName, quantity: item.quantity,
          price: item.product.price, status: 'En proceso', correo: address,
        }).pipe(timeout(30000)));
        this.setStatus(item, 'succeeded');
      } catch (error: unknown) {
        const status = typeof error === 'object' && error !== null && 'status' in error ? Number(error.status) : 0;
        // Interrupted responses may arrive after server acceptance. Never auto-retry.
        this.setStatus(item, [400, 401, 403, 404, 422].includes(status) ? 'failed' : 'unknown');
      }
    }
  }

  private setStatus(line: CartLine, status: CartStatus): void {
    this.refresh();
    const next = { ...line, status };
    this.update(this.items().some(item => item.product.id === line.product.id)
      ? this.items().map(item => item.product.id === line.product.id ? next : item)
      : [...this.items(), next]);
  }

  private refresh(): void {
    if (!this.storageAvailable) return;
    const saved = this.readStored();
    if (saved) {
      // A storage event from another tab must not turn this tab's live request into
      // an interrupted one. Other tabs and reloads keep pending requests locked as unknown.
      const pending = this.busy() ? this.items().filter(item => item.status === 'pending') : [];
      this.state.set(saved.map(item => pending.find(line => line.product.id === item.product.id) ?? item));
    }
  }
  private update(items: readonly CartLine[]): void {
    this.state.set(items);
    if (!this.storageAvailable) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items.map(item => ({ id: item.product.id, quantity: item.quantity, status: item.status }))));
      this.storageWarning.set('');
    } catch {
      this.persistenceFailed();
    }
  }
  private persistenceFailed(): void {
    this.storageAvailable = false;
    this.storageWarning.set('Tu navegador no permite guardar el carrito. Conserva esta página abierta mientras revisas tu solicitud.');
  }
  private readStored(): readonly CartLine[] | null {
    let raw: string | null;
    try { raw = localStorage.getItem(CART_STORAGE_KEY); }
    catch { this.persistenceFailed(); return null; }
    try {
      const saved: unknown = JSON.parse(raw || '[]');
      if (!Array.isArray(saved)) return null;
      const seen = new Set<number>();
      const items: CartLine[] = [];
      for (const entry of saved.slice(0, 100)) {
        if (!entry || typeof entry !== 'object' || !validQuantity(entry.quantity) || seen.has(entry.id)) continue;
        const product = CATALOG_PRODUCTS.find(item => item.id === entry.id);
        if (!product) continue;
        const status: CartStatus = entry.status === 'pending' || entry.status === 'unknown' ? 'unknown'
          : entry.status === 'succeeded' ? 'succeeded' : entry.status === 'failed' ? 'failed' : 'ready';
        seen.add(product.id);
        items.push({ product, quantity: entry.quantity, status });
      }
      return items;
    } catch { return null; }
  }
}
