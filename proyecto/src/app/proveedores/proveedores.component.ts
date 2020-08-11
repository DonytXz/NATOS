import { Component, OnInit } from '@angular/core';
import { ProveedoresService } from '../servicios/proveedores.service'

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
  }

  //metodo guardar empleado
  guardarproveedor(){
    this.proveedorservicio.insertarProveedor(this.proveedor)
    .subscribe(res=>{
      alert("El proveedor ha sido registrado con éxito")
      this.consultartodoproveedor();
      this.limpiarProvedores()
    },
    err=> console.log(err))
  }

  //metodo modificar
  modificarproveedor(){
    this.proveedorservicio.modificarProveedor(this.proveedor)
    .subscribe(res=>{
      alert("El proveedor ha sido modificado con éxito")
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
      alert("El proveeedor ha sido eliminado con éxito")
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
