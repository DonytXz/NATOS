import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VentasService {

  private VentaIns = `${environment.apiUrl}/solicitud_venta/insertar`;
  private VentaMod = `${environment.apiUrl}/solicitud_venta/modificar`;
  private VentaEli = `${environment.apiUrl}/solicitud_venta/eliminar`;
  private VentaCons = `${environment.apiUrl}/solicitud_venta/consultar`;

  constructor(private http: HttpClient) { }

  insertarVenta(ventas) {
    return this.http.post<any>(this.VentaIns, ventas);
  }

  modificarVenta(ventas) {
    return this.http.put<any>(this.VentaMod, ventas);
  }

  eliminarVenta(ventas) {
    return this.http.post<any>(this.VentaEli, ventas);
  }

  consultartodoVenta() {
    return this.http.get<any[]>(this.VentaCons);
  }
}
