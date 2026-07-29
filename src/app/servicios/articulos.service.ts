import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; //Ayuda a tener comunicación con el servidor

@Injectable({
  providedIn: 'root'
})
export class ArticulosService {

  //declaración de rutas de express
private ArticuloIns = 'http://localhost:3000/articulo/insertar';
private ArticuloMod = 'http://localhost:3000/articulo/modificar';
private ArticuloEli = 'http://localhost:3000/articulo/eliminar';
private ArticuloCons = 'http://localhost:3000/articulo/consultar';

  constructor(private http:HttpClient) { }

  //metodo insertar
  insertarArticulo(articulos){
    return this.http.post<any>(this.ArticuloIns, articulos)
  }

  //metodo modificar
  modificarArticulo(articulos){
    return this.http.put<any>(this.ArticuloMod,articulos);
  }

  //metodo eliminar
  eliminarArticulo(articulos){
    return this.http.post<any>(this.ArticuloEli, articulos);
  }

  //metodo consultar
  consultartodoArticulo(){
    return this.http.get<any>(this.ArticuloCons)
  }
}
