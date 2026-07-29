import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-temp',
    templateUrl: './temp.component.html',
    styleUrls: ['./temp.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class TempComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
