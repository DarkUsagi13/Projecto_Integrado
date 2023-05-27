import { Injectable } from '@angular/core';
import {url} from "./utils";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BusquedasService {

  url = url()
  constructor(
    private http: HttpClient,
  ) { }

  buscarUsuarios(valor: string, orden: string, filtro: string):Observable<any> {
    return this.http.get(this.url+`usuario/?ordering=${orden}${filtro}&search=${valor}`)
  }

 buscarConexionesPersonales(userId:string, valor: string, orden: string, filtro: string): Observable<any> {
    const params = new HttpParams().set('usuario', userId).set('finalizada', 'true').set('ordering', orden+filtro).set('search', valor);
    console.log(this.url+'conexion/'+params)
    // /?id=&usuario=2&puesto=&finalizada=&search=León
    return this.http.get<any>(this.url+`conexion/`, {params});
  }

}
