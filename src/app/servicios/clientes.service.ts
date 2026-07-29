import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; //Ayuda a tener comunicación con el servidor

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  ///declaracion de las rutas de express
  private ClienteIns = "http://localhost:3000/cliente/insertar"
  private ClienteMod = "http://localhost:3000/cliente/modificar"
  private ClienteEli = "http://localhost:3000/cliente/eliminar"
  private ClienteCons = "http://localhost:3000/cliente/consultar"

  constructor(private http:HttpClient) { }
//metodos para CRUD

//metodo insertar
insertarCliente(clientes){
  return this.http.post<any>(this.ClienteIns,clientes);
}

//metodo modificar
modificarCliente(clientes){
  return this.http.put<any>(this.ClienteMod,clientes);
}

//metodo eliminar
eliminarCliente(clientes){
  return this.http.post<any>(this.ClienteEli, clientes);
}

//metodo consultar
consultartodoCliente(){
  return this.http.get<any>(this.ClienteCons)
}

}
