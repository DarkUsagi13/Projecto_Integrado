import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {url} from "./utils";

@Injectable({
  providedIn: 'root'
})
export class EstacionesService {

  url: any = url()

  constructor(private http: HttpClient) { }

  getEstaciones(): Observable<any> {
    return this.http.get(this.url+`estacion/?ordering=nombre`, {observe: 'response'});
  }

  postEstacion(estacion: any, num_puestos: string): Observable<any> {
    const body = {
      ...estacion,
      num_puestos: num_puestos,
    }
    return this.http.post(this.url + `estacion/`, body, {observe: 'response'})
  }

  getPuesto(puesto_id: string): Observable<any> {
    const params = new HttpParams().set('id', puesto_id)
    return this.http.get(this.url + `puesto/`, {params, observe: 'response'})
  }

  getPuestos(estacion: string|null): Observable<any> {
    return  this.http.get(this.url+`puesto/?estacion=${estacion}&ordering=id`, {observe: 'response'});
  }

  postPuestos(estacion_id: string, num_puestos: string): Observable<any> {
    const body = {
      estacion_id : estacion_id,
      num_puestos : num_puestos,
    }
    return this.http.post(this.url + `puesto/`, body, {observe: 'response'})
  }

  estadisticas_estaciones(): Observable<any> {
    return this.http.get(this.url+`estacion/estadisticas_estaciones/`, {observe: 'response'})
  }

  editarEstacion(id_estacion: string, estacion: any): Observable<any> {
    return this.http.put(this.url + `estacion/${id_estacion}/`, estacion, {observe: 'response'})
  }

}
