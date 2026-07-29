import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; //Ayuda a tener comunicación con el servidor

@Injectable({
  providedIn: 'root'
})
export class TarimasService {
//declaración de rutas de express
private TarimaIns = 'http://localhost:3000/tarima/insertar';
private TarimaMod = 'http://localhost:3000/tarima/modificar';
private TarimaEli = 'http://localhost:3000/tarima/eliminar';
private TarimaCons = 'http://localhost:3000/tarima/consultar';

  constructor(private http:HttpClient) { }
  //declaración de metodos

  //metodo insertar
  insertarTarima(tarimas){
    return this.http.post<any>(this.TarimaIns, tarimas) 
  }

  //metodo modificar
  modificarTarima(tarimas){
    return this.http.put<any>(this.TarimaMod,tarimas);
  }

  //metodo eliminar
  eliminarTarima(tarimas){
    return this.http.post<any>(this.TarimaEli, tarimas);
  }

  //metodo consultar
  consultartodoTarima(){
    return this.http.get<any>(this.TarimaCons)
  }
}
