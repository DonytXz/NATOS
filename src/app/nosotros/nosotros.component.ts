import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-nosotros',
  imports: [RouterLink],
  templateUrl: './nosotros.component.html',
  styleUrls: ['./nosotros.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NosotrosComponent {}
