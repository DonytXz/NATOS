import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; //para la comunicacion con mongodb

@Injectable({
  providedIn: 'root'
})
export class ComprasService {
//rutas expressjs
private CompraIns = 'http://localhost:3000/solicitud_compra/insertar';
private CompraMod = 'http://localhost:3000/solicitud_compra/modificar';
private CompraEli = 'http://localhost:3000/solicitud_compra/eliminar';
private CompraCons = 'http://localhost:3000/solicitud_compra/consultar';

  constructor(private http:HttpClient) { }

//metodo insertar
insertarCompra(compras){
  return this.http.post<any>(this.CompraIns, compras) 
}

//metodo modificar
modificarCompra(compras){
  return this.http.put<any>(this.CompraMod, compras);
}

//metodo eliminar
eliminarCompra(compras){
  return this.http.post<any>(this.CompraEli, compras);
}

//metodo consultar
consultartodoCompra(){
  return this.http.get<any>(this.CompraCons)
}

}
