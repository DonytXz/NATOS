import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; //Ayuda a tener comunicación con el servidor

@Injectable({
  providedIn: 'root'
})
export class EmpleadosService {

  //declaración de rutas de express
  private EmpleadoIns = 'http://localhost:3000/empleado/insertar';
  private EmpleadoMod = 'http://localhost:3000/empleado/modificar';
  private EmpleadoEli = 'http://localhost:3000/empleado/eliminar';
  private EmpleadoCons = 'http://localhost:3000/empleado/consultar';

  constructor(private http:HttpClient) { }


  //metodo insertar
  insertarEmpleado(empleados){
    return this.http.post<any>(this.EmpleadoIns,empleados) 
  }

  //metodo modificar
  modificarEmpleado(empleados){
    return this.http.put<any>(this.EmpleadoMod,empleados);
  }

  //metodo eliminar
  eliminarEmpleado(empleados){
    return this.http.post<any>(this.EmpleadoEli, empleados);
  }

  //metodo consultar
  consultartodoEmpleado(){
    return this.http.get<any>(this.EmpleadoCons)
  }
}
