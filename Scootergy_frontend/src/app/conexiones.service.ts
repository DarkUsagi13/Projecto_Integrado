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

  getConexionesActivas(userId: string, page: number = 1): Observable<any> {
    const params = new HttpParams().set('usuario', userId).set('finalizada', 'false').set('page', page.toString());
    return this.http.get(this.url + 'conexion/', { params });
  }

  getConexionesFinalizadas(userId: string, page: number): Observable<any> {
    const params = new HttpParams().set('usuario', userId).set('finalizada', 'true').set('page', page.toString());
    return this.http.get<any>(this.url+`conexion/`, {params});
  }

  getConexionesMes(userId: string | null): Observable<any> {
    return this.http.get(this.url+`conexion/?usuario=${userId}&mes=${this.mes}&finalizada=true`);
  }

  postConexion(conexion: any): Observable<any> {
    return this.http.post<any>(this.url+`conexion/`, conexion);
  }

  getConexionActual(usuario: string, puesto: string): Observable<any>{
    return this.http.get<any>(this.url+`/conexion/conexion_actual/?usuario=${usuario}&puesto=${puesto}`)
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
