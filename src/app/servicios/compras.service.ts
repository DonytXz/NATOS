import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ComprasService {

  private CompraIns = `${environment.apiUrl}/solicitud_compra/insertar`;
  private CompraMod = `${environment.apiUrl}/solicitud_compra/modificar`;
  private CompraEli = `${environment.apiUrl}/solicitud_compra/eliminar`;
  private CompraCons = `${environment.apiUrl}/solicitud_compra/consultar`;

  constructor(private http: HttpClient) { }

  insertarCompra(compras){
    return this.http.post<any>(this.CompraIns, compras);
  }

  modificarCompra(compras){
    return this.http.put<any>(this.CompraMod, compras);
  }

  eliminarCompra(compras){
    return this.http.post<any>(this.CompraEli, compras);
  }

  consultartodoCompra(){
    return this.http.get<any[]>(this.CompraCons);
  }
}
