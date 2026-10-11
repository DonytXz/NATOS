import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-contacto',
  imports: [RouterLink],
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactoComponent {}
