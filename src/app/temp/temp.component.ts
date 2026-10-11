import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-temp',
  templateUrl: './temp.component.html',
  styleUrls: ['./temp.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TempComponent {}
