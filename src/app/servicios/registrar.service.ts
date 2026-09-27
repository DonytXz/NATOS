import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegistrarService {

  private Registrar = `${environment.apiUrl}/user/registrar`;

  constructor(private http: HttpClient) { }

  insertar(usuario){
    return this.http.post<any>(this.Registrar, usuario);
  }
}
