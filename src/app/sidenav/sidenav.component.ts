import { Component, OnInit, AfterViewInit, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { LoginService } from '../servicios/login.service';

declare var M: any;

@Component({
    selector: 'app-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class SidenavComponent implements OnInit, AfterViewInit {

  @HostBinding('class.is-open')
  entrar=false

  constructor(private loginservicio:LoginService ) { }

  ngOnInit(): void {
    this.loginservicio.change.subscribe(isOpen =>{
      this.entrar = isOpen;
    })
    this.llenarentrar();
  }

  ngAfterViewInit(): void {
    if (typeof M !== 'undefined') {
      const sidenavs = document.querySelectorAll('.sidenav');
      if (sidenavs.length && M.Sidenav) {
        M.Sidenav.init(sidenavs);
      }
      const dropdowns = document.querySelectorAll('.dropdown-trigger');
      if (dropdowns.length && M.Dropdown) {
        M.Dropdown.init(dropdowns);
      }
    }
  }

  llenarentrar(){
    this.entrar=this.loginservicio.eslogueado();

  }

  cerrarsesion(){
    localStorage.removeItem('token');
    this.llenarentrar()
  }

}

