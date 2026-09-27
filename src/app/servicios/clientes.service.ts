import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  private ClienteIns = `${environment.apiUrl}/cliente/insertar`;
  private ClienteMod = `${environment.apiUrl}/cliente/modificar`;
  private ClienteEli = `${environment.apiUrl}/cliente/eliminar`;
  private ClienteCons = `${environment.apiUrl}/cliente/consultar`;

  constructor(private http: HttpClient) { }

  insertarCliente(clientes){
    return this.http.post<any>(this.ClienteIns, clientes);
  }

  modificarCliente(clientes){
    return this.http.put<any>(this.ClienteMod, clientes);
  }

  eliminarCliente(clientes){
    return this.http.post<any>(this.ClienteEli, clientes);
  }

  consultartodoCliente(){
    return this.http.get<any[]>(this.ClienteCons);
  }
}
