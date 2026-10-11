import { Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet, NavigationEnd } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { LoginService } from '../servicios/login.service';
@Component({
  selector: 'app-staff-shell',
  standalone: true, imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './staff-shell.component.html', styleUrls: ['./staff-shell.component.css']
})
export class StaffShellComponent {
  readonly auth = inject(LoginService); readonly menuOpen = signal(false);
  @ViewChild('menuButton') menuButton?: ElementRef<HTMLButtonElement>;
  @ViewChild('staffNav') navigation?: ElementRef<HTMLElement>;
  readonly groups = [
    { name: 'Gestión', links: [{ label: 'Pedidos', path: '/admin/pedidos' }] },
    { name: 'Inventario', links: [{ label: 'Tarimas', path: '/admin/tarimas' }, { label: 'Artículos', path: '/admin/articulos' }] },
    { name: 'Operaciones', links: [{ label: 'Ventas', path: '/admin/ventas' }, { label: 'Compras', path: '/admin/compras' }] },
    { name: 'Directorio', links: [{ label: 'Clientes', path: '/admin/clientes' }, { label: 'Proveedores', path: '/admin/proveedores' }, { label: 'Empleados', path: '/admin/empleados' }] },
    { name: 'Herramientas', links: [{ label: 'Sugerencias', path: '/admin/sugerencias' }, { label: 'Temperatura', path: '/admin/temperatura' }] }
  ];
  constructor() { inject(Router).events.pipe(filter(e => e instanceof NavigationEnd), takeUntilDestroyed()).subscribe(() => this.menuOpen.set(false)); }
  toggleMenu(): void {
    if (this.menuOpen()) { this.closeMenu(); return; }
    this.menuOpen.set(true);
    setTimeout(() => { if (this.menuOpen()) this.navigation?.nativeElement.querySelector<HTMLAnchorElement>('a')?.focus(); });
  }
  closeMenu(): void {
    if (!this.menuOpen()) return;
    this.menuOpen.set(false);
    this.menuButton?.nativeElement.focus();
  }
}
