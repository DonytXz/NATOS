import { Component, OnInit } from '@angular/core';
import { ArticulosService } from '../servicios/articulos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-articulos',
  templateUrl: './articulos.component.html',
  styleUrls: ['./articulos.component.css']
})
export class ArticulosComponent implements OnInit {

  articulos;

  articulo = {
    id:"",
    descripcion:"",
    cantidad:"",
    precio:"",
    proveedor: ""
  }

  constructor(private articuloservicio: ArticulosService) { }

  p: number = 1;

  ngOnInit(): void {
    this.consultartodoarticulo()
  }

  //metodo guardar empleado
  guardararticulo() {
    this.articuloservicio.insertarArticulo(this.articulo)
      .subscribe(res => {
        Swal.fire({
          icon: 'success',
          title: 'Realizado',
          text: 'Registro guardado con exito',
          // footer: '<a href>Pro</a>'
        })
        this.limpiararticulo()
        this.consultartodoarticulo()
      },
        err => console.log(err))
  }

  editEste(art){
    this.articulo = art
  }

  //metodo modificar
  modificararticulo() {
    this.articuloservicio.modificarArticulo(this.articulo)
      .subscribe(res => {
        Swal.fire({
          icon: 'success',
          title: 'Realizado',
          text: 'Registro modificado con exito',
          // footer: '<a href>Pro</a>'
        })
        this.consultartodoarticulo()
        this.limpiararticulo()
      })
  }

  //metodo eliminar
  eliminararticulo() {
    this.articuloservicio.eliminarArticulo(this.articulo)
      .subscribe(res => {
        Swal.fire({
          icon: 'success',
          title: 'Realizado',
          text: 'Registro eliminado con exito',
        })
        this.limpiararticulo()
        this.consultartodoarticulo()
      })
  }

  //metodo consultar
  consultartodoarticulo() {
    this.articulos = this.articuloservicio.consultartodoArticulo();
  }

  //metodo limpiar campos
  limpiararticulo() {
    //esto para que se limpien los campos
    this.articulo.id = ""
    this.articulo.descripcion = ""
    this.articulo.cantidad = ""
    this.articulo.precio = ""
    this.articulo.proveedor = ""
  }

}
