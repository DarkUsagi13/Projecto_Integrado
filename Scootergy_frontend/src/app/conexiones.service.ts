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
  }

  getConexionesActivas(userId: string): Observable<any> {
    const params = new HttpParams().set('usuario', userId).set('finalizada', 'false');
    return this.http.get(this.url + 'conexion/', { params, observe : 'response' });
  }

  getConexionesFinalizadas(userId: string, orden: string, propiedad: string): Observable<any> {
    const params = new HttpParams().set('usuario', userId).set('finalizada', 'true').set('ordering', orden+propiedad);
    return this.http.get<any>(this.url+`conexion/`, {params});
  }

  postConexion(conexion: any, puesto_id: string, patinete_id: string): Observable<any> {
    const body = {
      ...conexion,
      puesto_id: puesto_id,
      patinete_id: patinete_id
    };
    return this.http.post<any>(this.url+`conexion/`, body, {observe: 'response'});
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

  gasto_y_consumo_total(usuario_id: string, mes: number) {
    const params = new HttpParams().set('usuario', usuario_id).set('mes', mes)
    return this.http.get<any>(this.url+`/conexion/gasto_y_consumo_total/`, {params})
  }

}
