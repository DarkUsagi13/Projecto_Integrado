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
    console.log(this.url+params)
    return this.http.get(this.url + 'conexion/', { params });
  }

  getConexionesFinalizadas(userId: string, orden: string, propiedad: string): Observable<any> {
    const params = new HttpParams().set('usuario', userId).set('finalizada', 'true').set('ordering', orden+propiedad);
    return this.http.get<any>(this.url+`conexion/`, {params});
  }

  postConexion(conexion: any): Observable<any> {
    return this.http.post<any>(this.url+`conexion/`, conexion);
  }

  getConexionActual(usuario: string, puesto: string): Observable<any>{
    const params = new HttpParams().set('usuario', usuario).set('puesto', puesto);
    return this.http.get(this.url + 'conexion/conexion_actual', { params, observe: 'response' });
  }

  getConexionPagada(id: string): Observable<any>{
    const params = new HttpParams().set('id', id);
    return this.http.get<any>(this.url+`conexion/`, {params});
  }

  calcularImporteConexion(usuario: any, id_conexion: any):Observable<any> {
    const params = new HttpParams().set('usuario', usuario).set('id', id_conexion);
    return this.http.get<any>(this.url+`conexion/calcular_importe`, { params, observe: 'response' });
  }

  consumoTotalMes(usuario: string): Observable<any> {
    return this.http.get<any>(this.url+`conexion/consumo_total/?usuario=${usuario}&mes=${this.mes}&finalizada=true`)
  }

  consumoTotal(usuario: string): Observable<any> {
    const params = new HttpParams().set('usuario', usuario);
    return this.http.get<any>(this.url+`conexion/`, {params});
  }

  gastoTotalMes(usuario:string): Observable<any>{
    const params = new HttpParams().set('usuario', usuario).set('mes', this.mes);
    return this.http.get<any>(this.url+`conexion/gasto_total`, {params});
  }

  gastoTotal(usuario:string): Observable<any>{
    return this.http.get<any>(this.url+`conexion/gasto_total/?usuario=${usuario}`)
  }

}
