import { Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LoginService } from '../servicios/login.service';
import { CartStateService } from '../core/cart-state.service';
@Component({ selector: 'app-sidenav', standalone: true, imports: [RouterLink, RouterLinkActive], templateUrl: './sidenav.component.html', styleUrl: './sidenav.component.css' })
export class SidenavComponent {
  readonly auth = inject(LoginService); readonly cart = inject(CartStateService); readonly menuOpen = signal(false);
  @ViewChild('menuButton') menuButton?: ElementRef<HTMLButtonElement>;
  constructor() { inject(Router).events.pipe(filter(event => event instanceof NavigationEnd), takeUntilDestroyed()).subscribe(() => this.menuOpen.set(false)); }
  closeMenu(): void { this.menuOpen.set(false); this.menuButton?.nativeElement.focus(); }
}
