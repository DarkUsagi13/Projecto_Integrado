import {Injectable} from '@angular/core';
import {url} from "./utils";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BusquedasService {

  url = url()

  totalUsuario: any;

  constructor(
    private http: HttpClient,
  ) {
  }

  buscarUsuarios(valor: string, orden: string, filtro: string): Observable<any> {
    return this.http.get(this.url + `usuario/?ordering=${orden}${filtro}&search=${valor}`, {observe: 'response'})
  }

  buscarConexiones(userId: string, finalizada: string, patinete: string, estacion: string, fecha_inicio: string, fecha_fin: string): Observable<any> {
    const params = new HttpParams().set('usuario', userId).set('finalizada', finalizada).set('patinete', patinete).set('estacion', estacion).set('fecha_inicio', fecha_inicio).set('fecha_fin', fecha_fin);
    return this.http.get<any>(this.url + `conexion/`, {params, observe: 'response'});
  }

  buscarConexionesActivas(userId: string, patinete: string, estacion: string, fecha_inicio: string, fecha_fin: string): Observable<any> {
    const params = new HttpParams().set('usuario', userId).set('patinete', patinete).set('estacion', estacion).set('fecha_inicio', fecha_inicio).set('fecha_fin', fecha_fin)
    return this.http.get<any>(this.url + `conexion/conexiones_activas`, {params, observe: 'response'})
  }

  buscarEstaciones(orden: string, filtro: string, valor: string): Observable<any> {
    const params = new HttpParams().set('ordering', orden + filtro).set('search', valor);
    return this.http.get(this.url + `estacion/`, {params, observe: 'response'})
  }

}
