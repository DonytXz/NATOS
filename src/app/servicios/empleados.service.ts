import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmpleadosService {

  private EmpleadoIns = `${environment.apiUrl}/empleado/insertar`;
  private EmpleadoMod = `${environment.apiUrl}/empleado/modificar`;
  private EmpleadoEli = `${environment.apiUrl}/empleado/eliminar`;
  private EmpleadoCons = `${environment.apiUrl}/empleado/consultar`;

  constructor(private http: HttpClient) { }

  insertarEmpleado(empleados){
    return this.http.post<any>(this.EmpleadoIns, empleados);
  }

  modificarEmpleado(empleados){
    return this.http.put<any>(this.EmpleadoMod, empleados);
  }

  eliminarEmpleado(empleados){
    return this.http.post<any>(this.EmpleadoEli, empleados);
  }

  consultartodoEmpleado(){
    return this.http.get<any[]>(this.EmpleadoCons);
  }
}
