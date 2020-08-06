import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginService } from './servicios/login.service';

@Injectable({
  providedIn: 'root'
})
export class LogingGuard implements CanActivate {
  constructor(private router:Router, private loginservicio:LoginService){

  }
  canActivate(): boolean{
    if(this.loginservicio.eslogueado()){
      return true;
    }else{ //si es falso se redirige a login
      this.router.navigate(['/Iniciar'])
      return false;
    }
    
  } 
}
