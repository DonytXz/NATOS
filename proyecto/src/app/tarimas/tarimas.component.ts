import { Component, OnInit } from '@angular/core';
import { TarimasService } from '../servicios/tarimas.service'
import Swal from 'sweetalert2'

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

  p: number = 1;

  ngOnInit(): void {
    this.consultarTodoTarima()
  }
  
  //metodo guardar empleado
  guardarTarima(){
    this.tarimaservicio.insertarTarima(this.tarima)
    .subscribe(res=>{
      Swal.fire({
        icon: 'success',
        title: 'Realizado',
        text: 'Registro guardado con exito',
        // footer: '<a href>Pro</a>'
      })
      this.limpiarTarima()
      this.consultarTodoTarima()
    },
    err=> console.log(err))
  }

  //metodo modificar
  modificarTarima(){
    this.tarimaservicio.modificarTarima(this.tarima)
    .subscribe(res=>{
      Swal.fire({
        icon: 'success',
        title: 'Realizado',
        text: 'Registro modificado con exito',
        // footer: '<a href>Pro</a>'
      })
      this.limpiarTarima()
      this.consultarTodoTarima();
    })
  }
  editEste(tar){
    this.tarima = tar
  }

  //metodo eliminar
  eliminarTarima(){
    this.tarimaservicio.eliminarTarima(this.tarima)
    .subscribe(res=>{
      alert("La tarima ha sido eliminada con exito");
      //Swal.fire({
        //icon: 'success',
        //title: 'Realizado',
        //text: 'Registro eliminado con exito',
        // footer: '<a href>Pro</a>'
      //})
      this.limpiarTarima()
      this.consultarTodoTarima()
    })
  }





  //metodo consultar
  consultarTodoTarima(){
      this.tarimas=this.tarimaservicio.consultartodoTarima();

      // Swal.fire({
      //   icon: 'success',
      //   title: 'Realizado',
      //   text: 'Consulta exitosa',
      //   // footer: '<a href>Pro</a>'
      // })


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
