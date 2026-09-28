import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';

declare var M: any;

@Component({
    selector: 'app-inicio',
    templateUrl: './inicio.component.html',
    styleUrls: ['./inicio.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class InicioComponent implements OnInit, AfterViewInit, OnDestroy {
  private parallaxInstances: any[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    if (typeof M !== 'undefined' && M.Parallax) {
      const elems = document.querySelectorAll('.parallax');
      if (elems.length) {
        this.parallaxInstances = M.Parallax.init(elems);
      }
    }
  }

  ngOnDestroy(): void {
    if (this.parallaxInstances && Array.isArray(this.parallaxInstances)) {
      this.parallaxInstances.forEach((instance: any) => {
        if (instance && typeof instance.destroy === 'function') {
          instance.destroy();
        }
      });
    }
  }
}
