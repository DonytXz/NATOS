import { Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet, NavigationEnd } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { LoginService } from '../servicios/login.service';
@Component({
  standalone: true, imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `<div class="staff-layout" (keydown.escape)="closeMenu()">
    <aside class="staff-sidebar" [class.open]="menuOpen()" id="staff-navigation"><a routerLink="/inicio" class="staff-brand">NATOS <span>ESPACIO DE TRABAJO</span></a><nav #staffNav aria-label="Administración">@for(group of groups; track group.name) { <div class="nav-group"><p>{{ group.name }}</p>@for(link of group.links; track link.path) {<a [routerLink]="link.path" routerLinkActive="active" ariaCurrentWhenActive="page">{{ link.label }}<span aria-hidden="true">↗</span></a>}</div>}</nav><a routerLink="/inicio" class="back-store">← Ir al sitio público</a></aside>
    <div class="staff-main"><header class="staff-topbar"><button #menuButton type="button" class="staff-toggle button-secondary" [attr.aria-expanded]="menuOpen()" aria-controls="staff-navigation" (click)="toggleMenu()">{{menuOpen() ? 'Cerrar menú' : 'Menú'}}</button><span>Administración <span class="topbar-separator">/</span> NATOS</span><button type="button" class="logout" (click)="auth.logout()">Cerrar sesión <span aria-hidden="true">↗</span></button></header><main id="contenido" tabindex="-1"><router-outlet /></main></div>
  </div>`, styleUrl: './staff-shell.component.css'
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
