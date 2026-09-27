import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TarimasService {

  private TarimaIns = `${environment.apiUrl}/tarima/insertar`;
  private TarimaMod = `${environment.apiUrl}/tarima/modificar`;
  private TarimaEli = `${environment.apiUrl}/tarima/eliminar`;
  private TarimaCons = `${environment.apiUrl}/tarima/consultar`;

  constructor(private http: HttpClient) { }

  insertarTarima(tarimas){
    return this.http.post<any>(this.TarimaIns, tarimas);
  }

  modificarTarima(tarimas){
    return this.http.put<any>(this.TarimaMod, tarimas);
  }

  eliminarTarima(tarimas){
    return this.http.post<any>(this.TarimaEli, tarimas);
  }

  consultartodoTarima(){
    return this.http.get<any[]>(this.TarimaCons);
  }
}
