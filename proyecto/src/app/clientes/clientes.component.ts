import { Component, OnInit } from '@angular/core';
import { ClientesService } from '../servicios/clientes.service'
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  clientes;

  cliente={
    id:"",
    empresa:"",
        nombre:"",
        apellido_paterno:"",
        apellido_materno:"",
        puesto:"",
    rfc:"",
    tipo_persona:""
  }

  constructor(private clienteservicio:ClientesService) { }

  p: number = 1;


  ngOnInit(): void {
    this.consultartodocliente();
  }

  //metodo guardar empleado
  guardarcliente(){
    this.clienteservicio.insertarCliente(this.cliente)
    .subscribe(res=>{
      Swal.fire({
        icon: 'success',
        title: 'Realizado',
        text: 'Registro guardado con exito',
        // footer: '<a href>Pro</a>'
      })
      this.limpiarcliente();
      this.consultartodocliente();
    },
    err=> console.log(err))
  }

  editEste(cli){
    this.cliente = cli
  }

  //metodo modificar
  modificarcliente(){
    this.clienteservicio.modificarCliente(this.cliente)
    .subscribe(res=>{
      Swal.fire({
        icon: 'success',
        title: 'Realizado',
        text: 'Registro modificado con exito',
        // footer: '<a href>Pro</a>'
      })
      this.consultartodocliente()
      this.limpiarcliente()
      this.consultartodocliente()
    })
  }

  //metodo eliminar
  eliminarcliente(){
    this.clienteservicio.eliminarCliente(this.cliente)
    .subscribe(res=>{
      Swal.fire({
        icon: 'success',
        title: 'Realizado',
        text: 'Registro eliminado con exito',
      })
      this.limpiarcliente()
      this.consultartodocliente()
    })
  }

  //metodo consultar
  consultartodocliente(){
      this.clientes=this.clienteservicio.consultartodoCliente();
  }

  //metodo limpiar campos
  limpiarcliente(){
    //esto para que se limpien los campos
    this.cliente.id=""
    this.cliente.empresa=""
    this.cliente.nombre=""
    this.cliente.apellido_paterno=""
    this.cliente.apellido_materno=""
    this.cliente.puesto=""
    this.cliente.rfc=""
    this.cliente.tipo_persona=""
  }
}
