import { Injectable,Output,EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http'; //se importa para la comunicaión con la bd 

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private Loginurl = 'http://localhost:3000/user/login'

  @Output() change: EventEmitter<boolean> = new EventEmitter();

  constructor(private http: HttpClient) { }

  //metodo para inicar sesión
  login(usuarios){
    return this.http.post<any>(this.Loginurl,usuarios)
  }

  eslogueado(){
    this.change.emit(!!localStorage.getItem('token'))
    return !!localStorage.getItem('token')
  }
}
