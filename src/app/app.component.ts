import { Component, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
@Component({ selector: 'app-root', templateUrl: './app.component.html', standalone: false })
export class AppComponent {
  title = 'NATOS';
  private document = inject(DOCUMENT);
  constructor() {
    inject(Router).events.pipe(filter(event => event instanceof NavigationEnd), takeUntilDestroyed()).subscribe(() => {
      setTimeout(() => this.document.getElementById('contenido')?.focus({ preventScroll: true }));
    });
  }
  skipToContent(event: Event): void { event.preventDefault(); this.document.getElementById('contenido')?.focus(); }
}
