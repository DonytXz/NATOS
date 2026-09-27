import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProveedoresService {

  private ProveedorIns = `${environment.apiUrl}/proveedor/insertar`;
  private ProveedorMod = `${environment.apiUrl}/proveedor/modificar`;
  private ProveedorEli = `${environment.apiUrl}/proveedor/eliminar`;
  private ProveedorCons = `${environment.apiUrl}/proveedor/consultar`;

  constructor(private http: HttpClient) { }

  insertarProveedor(proveedores){
    return this.http.post<any>(this.ProveedorIns, proveedores);
  }

  modificarProveedor(proveedores){
    return this.http.put<any>(this.ProveedorMod, proveedores);
  }

  eliminarProveedor(proveedores){
    return this.http.post<any>(this.ProveedorEli, proveedores);
  }

  consultartodoProveedor(){
    return this.http.get<any[]>(this.ProveedorCons);
  }
}
