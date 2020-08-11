import { Component, OnInit } from '@angular/core';
import { EmpleadosService } from '../servicios/empleados.service'


@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.css']
})
export class EmpleadosComponent implements OnInit {

  empleados;

  empleado={
    id:"",
    nombre:"",
    apellido_paterno:"",
    apellido_materno:"",
    puesto:"",
    sueldo:""
  }

  constructor(private empleadoservicio:EmpleadosService) { }

  p: number = 1;

  ngOnInit(): void {
    this.consultartodoempleado()
  }

  //metodo guardar empleado
  guardarempleado(){
    this.empleadoservicio.insertarEmpleado(this.empleado)
    .subscribe(res=>{
      alert("El empleado ha sido registrado con éxito")

      this.limpiarempleado()
      this.consultartodoempleado()
    },
    err=> console.log(err))
  }

  //metodo modificar
  modificarempleado(){
    this.empleadoservicio.modificarEmpleado(this.empleado)
    .subscribe(res=>{
      alert("El empleado ha sido modificado con éxito")

      this.limpiarempleado()
      this.consultartodoempleado();
    })
  }
  editEste(emp){
    this.empleado = emp
  }

  //metodo eliminar
  eliminarempleado(){
    this.empleadoservicio.eliminarEmpleado(this.empleado)
    .subscribe(res=>{
      alert("El empleado ha sido eliminado con éxito")
      this.limpiarempleado()
      this.consultartodoempleado()
    })
  }





  //metodo consultar
  consultartodoempleado(){
      this.empleados=this.empleadoservicio.consultartodoEmpleado();
  }

  //metodo limpiar campos
  limpiarempleado(){
    //esto para que se limpien los campos
    this.empleado.id=""
    this.empleado.nombre=""
    this.empleado.apellido_materno=""
    this.empleado.apellido_paterno=""
    this.empleado.puesto=""
    this.empleado.sueldo=""
  }
}
