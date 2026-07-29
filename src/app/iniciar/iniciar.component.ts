import { Component, OnInit, HostListener } from '@angular/core';
import { LoginService } from '../servicios/login.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-iniciar',
  templateUrl: './iniciar.component.html',
  styleUrls: ['./iniciar.component.css']
})
export class IniciarComponent implements OnInit {
  
  usuario={
    username:"",
    password:""
  }

  constructor(private loginservicio:LoginService, private router:Router) { }

  ngOnInit(): void {
  }

  @HostListener('login')

  login(){
    this.loginservicio.login(this.usuario).subscribe(res =>{
      Swal.fire({
        icon: 'success',
        title: 'Realizado',
        text: 'Ingresaste con exito',
        // footer: '<a  <a href="#!" routerLink="Iniciar">Inicia sesion</a>'
      })
    localStorage.setItem('token',res.jwtoken) //backend
    this.loginservicio.eslogueado()
    this.router.navigate(['/Inicio'])
  },
  
    err =>  Swal.fire({
      icon: 'error',
      title: 'Realizado',
      text: 'Verifica tus datos',
      // footer: '<a  <a href="#!" routerLink="Iniciar">Inicia sesion</a>'
    })
    
    )
  }

}
