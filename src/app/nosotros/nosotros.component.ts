import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-nosotros',
    templateUrl: './nosotros.component.html',
    styleUrls: ['./nosotros.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class NosotrosComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
