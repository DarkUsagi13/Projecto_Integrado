import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {url} from "./utils";

@Injectable({
  providedIn: 'root'
})
export class ConexionesService {

  public conexionesActivas: any[] = [];
  public url: any = url()
  public mes: any = {};

  constructor(
    private http: HttpClient,
  ) {
    this.mes = new Date().getMonth() + 1;
  }

  getConexionesActivas(userId: string): Observable<any> {
    const params = new HttpParams().set('usuario', userId).set('finalizada', 'false');
    return this.http.get(this.url + 'conexion/', { params });
  }

  getConexionesFinalizadas(userId: string, orden: string, propiedad: string): Observable<any> {
    // console.log(propiedad)
    // console.log(orden)
    const params = new HttpParams().set('usuario', userId).set('finalizada', 'true').set('ordering', orden+propiedad);
    console.log(this.url + `conexion/` + params)
    return this.http.get<any>(this.url+`conexion/`, {params});
  }

  postConexion(conexion: any): Observable<any> {
    return this.http.post<any>(this.url+`conexion/`, conexion);
  }

  getConexionActual(usuario: string, puesto: string): Observable<any>{
    return this.http.get<any>(this.url+`/conexion/conexion_actual/?usuario=${usuario}&puesto=${puesto}`)
  }

  getConexionPagada(id: string): Observable<any>{
    const params = new HttpParams().set('id', id);
    return this.http.get<any>(this.url+`conexion/`, {params});
  }

  calcularMontoConexion(usuario: any, id_conexion: any):Observable<any> {
    return this.http.get<any>(this.url+`conexion/calcular_monto/?usuario=${usuario}&id=${id_conexion}`)
  }

  consumoTotalMes(usuario: string): Observable<any> {
    return this.http.get<any>(this.url+`conexion/consumo_total/?usuario=${usuario}&mes=${this.mes}&finalizada=true`)
  }

  consumoTotal(usuario: string): Observable<any> {
    return this.http.get<any>(this.url+`conexion/consumo_total/?usuario=${usuario}`)
  }

  gastoTotalMes(usuario:string): Observable<any>{
    return this.http.get<any>(this.url+`conexion/gasto_total/?usuario=${usuario}&mes${this.mes}`)
  }

  gastoTotal(usuario:string): Observable<any>{
    return this.http.get<any>(this.url+`conexion/gasto_total/?usuario=${usuario}`)
  }

}
