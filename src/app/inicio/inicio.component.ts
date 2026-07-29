import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-inicio',
    templateUrl: './inicio.component.html',
    styleUrls: ['./inicio.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class InicioComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
