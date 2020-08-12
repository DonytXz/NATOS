import { Component, OnInit } from '@angular/core';
import { ProveedoresService } from '../servicios/proveedores.service'
import Swal from 'sweetalert2';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css']
})
export class ProveedoresComponent implements OnInit {

  proveedores;

  proveedor={
    id:"",
    empresa:"",
    nombre:"",
    apellido_paterno:"",
    apellido_materno:"",
    puesto:"",
    rfc:"",
    tipo_persona:""
  }

  constructor(private proveedorservicio:ProveedoresService) { }
 
  p :number = 0; 

  ngOnInit(): void {
    this.consultartodoproveedor()
  }

  //metodo guardar empleado
  guardarproveedor(){
    this.proveedorservicio.insertarProveedor(this.proveedor)
    .subscribe(res=>{
      Swal.fire({
        icon: 'success',
        title: 'Realizado',
        text: 'Registro guardado con exito',
        // footer: '<a href>Pro</a>'
      })
      this.consultartodoproveedor();
      this.limpiarProvedores()
    },
    err=> console.log(err))
  }

  //metodo modificar
  modificarproveedor(){
    this.proveedorservicio.modificarProveedor(this.proveedor)
    .subscribe(res=>{
      Swal.fire({
        icon: 'success',
        title: 'Realizado',
        text: 'Registro modificado con exito',
        // footer: '<a href>Pro</a>'
      })
      this.consultartodoproveedor();
      this.limpiarProvedores()
    })
  }

  editEste(pro){
    this.proveedor = pro
  }


  //metodo eliminar
  eliminarproveedor(){
    this.proveedorservicio.eliminarProveedor(this.proveedor)
    .subscribe(res=>{
      Swal.fire({
        icon: 'success',
        title: 'Realizado',
        text: 'Registro eliminado con exito',
      })
      this.limpiarProvedores()
      this.consultartodoproveedor()

    })
  }

  //metodo consultar
  consultartodoproveedor(){
      this.proveedores=this.proveedorservicio.consultartodoProveedor();
  }

  //metodo limpiar campos
  limpiarProvedores(){
    //esto para que se limpien los campos
    this.proveedor.id=""
    this.proveedor.empresa=""
    this.proveedor.nombre=""
    this.proveedor.apellido_paterno=""
    this.proveedor.apellido_materno=""
    this.proveedor.puesto=""
    this.proveedor.rfc=""
    this.proveedor.tipo_persona=""
  }

}
