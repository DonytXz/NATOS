import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class RegistrarService {

private Registrar = "http://localhost:3000/user/registrar"

  constructor(private http:HttpClient) { }

  insertar(usuario){
    return this.http.post<any>(this.Registrar,usuario)
  }

}
