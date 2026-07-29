import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; //Ayuda a tener comunicación con el servidor

@Injectable({
  providedIn: 'root'
})
export class ProveedoresService {
//declaración de rutas de express
private ProveedorIns = 'http://localhost:3000/proveedor/insertar';
private ProveedorMod = 'http://localhost:3000/proveedor/modificar';
private ProveedorEli = 'http://localhost:3000/proveedor/eliminar';
private ProveedorCons = 'http://localhost:3000/proveedor/consultar';


  constructor(private http:HttpClient) { }

  //declaración de metodos

  //metodo insertar
  insertarProveedor(proveedores){
    return this.http.post<any>(this.ProveedorIns,proveedores) 
  }

  //metodo modificar
  modificarProveedor(proveedores){
    return this.http.put<any>(this.ProveedorMod,proveedores);
  }

  //metodo eliminar
  eliminarProveedor(proveedores){
    return this.http.post<any>(this.ProveedorEli, proveedores);
  }

  //metodo consultar
  consultartodoProveedor(){
    return this.http.get<any>(this.ProveedorCons)
  }
}
