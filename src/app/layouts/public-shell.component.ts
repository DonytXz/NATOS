import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { SidenavComponent } from '../sidenav/sidenav.component';
@Component({
  selector: 'app-public-shell',
  standalone: true, imports: [RouterOutlet, RouterLink, SidenavComponent],
  templateUrl: './public-shell.component.html',
  styleUrls: ['./public-shell.component.css']
})
export class PublicShellComponent { readonly year = new Date().getFullYear(); }
