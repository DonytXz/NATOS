import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-copy',
    templateUrl: './copy.component.html',
    styleUrls: ['./copy.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class CopyComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
