import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; //Ayuda a tener comunicación con el servidor

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  //declaración de rutas de express
  private PedidoIns = 'http://localhost:3000/carrito/insertar';
  private PedidoCons = 'http://localhost:3000/carrito/consultar';


  constructor(private http:HttpClient) { }


  //metodo insertar
  insertarPedido(pedidos){
    return this.http.post<any>(this.PedidoIns,pedidos) 
  }

  //metodo modificar
  modificarPedido(pedidos){
    return this.http.put<any>(this.PedidoCons,pedidos);
  }
    //metodo consultar
    consultarTodoPedido(){
      return this.http.get<any>(this.PedidoCons)
    }

}
