import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ArticulosService {

  private ArticuloIns = `${environment.apiUrl}/articulo/insertar`;
  private ArticuloMod = `${environment.apiUrl}/articulo/modificar`;
  private ArticuloEli = `${environment.apiUrl}/articulo/eliminar`;
  private ArticuloCons = `${environment.apiUrl}/articulo/consultar`;

  constructor(private http: HttpClient) { }

  insertarArticulo(articulos){
    return this.http.post<any>(this.ArticuloIns, articulos);
  }

  modificarArticulo(articulos){
    return this.http.put<any>(this.ArticuloMod, articulos);
  }

  eliminarArticulo(articulos){
    return this.http.post<any>(this.ArticuloEli, articulos);
  }

  consultartodoArticulo(){
    return this.http.get<any[]>(this.ArticuloCons);
  }
}
