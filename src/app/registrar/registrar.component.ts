import { Component, OnInit } from '@angular/core';
import { RegistrarService } from '../servicios/registrar.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.css']
})
export class RegistrarComponent implements OnInit {

  usuario={
    codigo:"",
    username:"",
    password:""
  }

  constructor(private registrarservicio:RegistrarService) { }

  ngOnInit(): void {
  }

  insertar(){
    this.registrarservicio.insertar(this.usuario).subscribe(res =>{
      Swal.fire({
        icon: 'success',
        title: 'Realizado',
        text: 'Te registraste con exito',
        // footer: '<a  <a href="#!" routerLink="Iniciar">Inicia sesion</a>'
      })
      console.log(res)
    },
    err => console.log(err)
    )
  }

}
