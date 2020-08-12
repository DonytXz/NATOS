import { Component, OnInit } from '@angular/core';
import { ComprasService } from '../servicios/compras.service';

@Component({
  selector: 'app-compras',
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.css']
})
export class ComprasComponent implements OnInit {

  constructor(private compraservicio: ComprasService) { }

  compras;

  compra = {
    id:"",
    proveedor:"",
    id_articulo:"",
    descripcion_articulo:"",
    cantidad_articulo:"",
    precio_articulo:""
  }
  p: number = 1;

  ngOnInit(): void {
    this.consultartodocompra()
  }

  //metodo guardar empleado
  guardarcompra() {
    this.compraservicio.insertarCompra(this.compra)
      .subscribe(res => {
        alert("La solicitud de compra ha sido registrado con éxito")
        this.limpiarcompra()
        this.consultartodocompra()
      },
        err => console.log(err))
  }

  //metodo modificar
  modificarcompra() {
    this.compraservicio.modificarCompra(this.compra)
      .subscribe(res => {
        alert("La solicitud de compra ha sido modificado con éxito")
        this.limpiarcompra()
        this.consultartodocompra()
      })
  }
  editEste(com){
    this.compra = com
  }

  //metodo eliminar
  eliminarcompra() {
    this.compraservicio.eliminarCompra(this.compra)
      .subscribe(res => {
        alert("La solicitud de compra ha sido eliminado con éxito")
        this.limpiarcompra()
        this.consultartodocompra()
      })
  }

  //metodo consultar
  consultartodocompra() {
    this.compras = this.compraservicio.consultartodoCompra();
  }

  //metodo limpiar campos
  limpiarcompra() {
    //esto para que se limpien los campos
    this.compra.id = ""
    this.compra.proveedor=""
    this.compra.id_articulo =""
    this.compra.descripcion_articulo = ""
    this.compra.cantidad_articulo = ""
    this.compra.precio_articulo = ""
  }

}
