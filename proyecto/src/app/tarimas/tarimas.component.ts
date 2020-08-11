import { Component, OnInit } from '@angular/core';
import { TarimasService } from '../servicios/tarimas.service'


@Component({
  selector: 'app-tarimas',
  templateUrl: './tarimas.component.html',
  styleUrls: ['./tarimas.component.css']
})
export class TarimasComponent implements OnInit {

  tarimas;

  tarima={
    id:"",
    descripcion:"",
    tipo:"",
    cantidad:"",
    precio:""
  }

  constructor(private tarimaservicio: TarimasService) { }

  p : number = 0;

  ngOnInit(): void {
    this.consultarTodoTarima()
  }
  
  //metodo guardar empleado
  guardarTarima(){
    this.tarimaservicio.insertarTarima(this.tarima)
    .subscribe(res=>{
      alert("El tarima ha sido registrado con éxito")
      this.consultarTodoTarima()
      this.limpiarTarima()
    },
    err=> console.log(err))
  }

  //metodo modificar
  modificarTarima(){
    this.tarimaservicio.modificarTarima(this.tarima)
    .subscribe(res=>{
      alert("El empleado ha sido modificado con éxito")
      this.consultarTodoTarima();
      this.limpiarTarima()
    })
  }
  editEste(tar){
    this.tarima = tar
  }

  //metodo eliminar
  eliminarTarima(){
    this.tarimaservicio.eliminarTarima(this.tarima)
    .subscribe(res=>{
      alert("El empleado ha sido eliminado con éxito")
      this.consultarTodoTarima()
      this.limpiarTarima()
    })
  }





  //metodo consultar
  consultarTodoTarima(){
      this.tarimas=this.tarimaservicio.consultartodoTarima();
  }


  //metodo limpiar campos
  limpiarTarima(){
    //esto para que se limpien los campos
    this.tarima.id=""
    this.tarima.descripcion=""
    this.tarima.tipo=""
    this.tarima.cantidad=""
    this.tarima.precio=""
  }


}
