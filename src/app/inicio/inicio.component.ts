import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({ selector: 'app-inicio', standalone: true, imports: [RouterLink], templateUrl: './inicio.component.html', styleUrl: './inicio.component.css', changeDetection: ChangeDetectionStrategy.OnPush })
export class InicioComponent {}
