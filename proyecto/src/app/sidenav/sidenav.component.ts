import { Component, OnInit,HostBinding } from '@angular/core';
import { LoginService } from '../servicios/login.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  @HostBinding('class.is-open')
  entrar=false

  constructor(private loginservicio:LoginService ) { }

  ngOnInit(): void {
    this.loginservicio.change.subscribe(isOpen =>{
      this.entrar = isOpen;
    })
    this.llenarentrar();
  }

  llenarentrar(){
    this.entrar=this.loginservicio.eslogueado();

  }

  cerrarsesion(){
    localStorage.removeItem('token');
    this.llenarentrar()
  }

}
