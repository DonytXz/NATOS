import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-copy',
  templateUrl: './copy.component.html',
  styleUrls: ['./copy.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CopyComponent {}
