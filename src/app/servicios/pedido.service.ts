import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  private PedidoIns = `${environment.apiUrl}/carrito/insertar`;
  private PedidoCons = `${environment.apiUrl}/carrito/consultar`;

  constructor(private http: HttpClient) { }

  insertarPedido(pedidos){
    return this.http.post<any>(this.PedidoIns, pedidos);
  }

  modificarPedido(pedidos){
    return this.http.put<any>(this.PedidoCons, pedidos);
  }

  consultarTodoPedido(){
    return this.http.get<any[]>(this.PedidoCons);
  }
}
