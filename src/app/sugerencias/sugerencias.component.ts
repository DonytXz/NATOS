import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LoginService } from '../servicios/login.service';

@Component({
  selector: 'app-sugerencias',
  templateUrl: './sugerencias.component.html',
  styleUrls: ['./sugerencias.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SugerenciasComponent {
  readonly auth = inject(LoginService);
}
