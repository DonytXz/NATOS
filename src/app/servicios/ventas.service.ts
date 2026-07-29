import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VentasService {
  //rutas de express
  private VentaIns = 'http://localhost:3000/solicitud_venta/insertar';
  private VentaMod = 'http://localhost:3000/solicitud_venta/modificar';
  private VentaEli = 'http://localhost:3000/solicitud_venta/eliminar';
  private VentaCons = 'http://localhost:3000/solicitud_venta/consultar';

  constructor(private http: HttpClient) { }

  //metodo insertar
  insertarVenta(ventas) {
    return this.http.post<any>(this.VentaIns, ventas)
  }

  //metodo modificar
  modificarVenta(ventas) {
    return this.http.put<any>(this.VentaMod, ventas);
  }

  //metodo eliminar
  eliminarVenta(ventas) {
    return this.http.post<any>(this.VentaEli, ventas);
  }

  //metodo consultar
  consultartodoVenta() {
    return this.http.get<any>(this.VentaCons)
  }

}
