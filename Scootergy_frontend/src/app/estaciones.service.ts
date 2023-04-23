import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Estacion} from "./estacion";

@Injectable({
  providedIn: 'root'
})
export class EstacionesService {

  constructor(private http: HttpClient) { }

  getEstaciones(): Observable<any> {
    return this.http.get(`http://127.0.0.1:8000/estacion`);
  }

  getPuestos(idEstacion: string|null): Observable<any> {
    return  this.http.get(`http://127.0.0.1:8000/puesto/?idEstacion=${idEstacion}`);
  }

  updatePuesto(idPuesto: string|null, puesto: any): Observable<any> {
    return this.http.put(`http://127.0.0.1:8000/puesto/${idPuesto}/`, puesto);
  }
}
