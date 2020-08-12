import { Component, OnInit } from '@angular/core';
import { VentasService } from '../servicios/ventas.service';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})
export class VentasComponent implements OnInit {

  ventas;

  venta={
    id:"",
    cliente:"",
    id_tarima:"",
    descripcion_tarima:"",
    cantidad:"",
    precio_tarima:""
  }

  constructor(private ventaservicio:VentasService) { }

  p: number = 1;

  ngOnInit(): void {
    this.consultartodoventa()
  }

//metodo guardar venta
guardarventa() {
  this.ventaservicio.insertarVenta(this.venta)
    .subscribe(res => {
      alert("La solicitud de venta ha sido registrado con éxito")
      this.limpiarventa()
      this.consultartodoventa()
    },
      err => console.log(err))
}

editEste(ven){
  this.venta = ven
}

//metodo modificar
modificarventa() {
  this.ventaservicio.modificarVenta(this.venta)
    .subscribe(res => {
      alert("La solicitud de venta ha sido modificado con éxito")
      this.consultartodoventa()
      this.limpiarventa()
    })
}

//metodo eliminar
eliminarventa() {
  this.ventaservicio.eliminarVenta(this.venta)
    .subscribe(res => {
      alert("La solicitud de venta ha sido eliminado con éxito")
      this.limpiarventa()
      this.consultartodoventa()
    })
}

//metodo consultar
consultartodoventa() {
  this.ventas = this.ventaservicio.consultartodoVenta();
}

//metodo limpiar campos
limpiarventa() {
  //esto para que se limpien los campos
  this.venta.id = ""
  this.venta.cliente = ""
  this.venta.id_tarima = ""
  this.venta.descripcion_tarima = ""
  this.venta.cantidad = ""
  this.venta.precio_tarima = ""
}


}
