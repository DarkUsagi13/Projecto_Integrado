import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {url} from "./utils";

@Injectable({
  providedIn: 'root'
})
export class EstacionesService {

  url: any = url()

  constructor(private http: HttpClient) { }

  getEstaciones(): Observable<any> {
    return this.http.get(this.url+`estacion`);
  }

  getPuestos(idEstacion: string|null): Observable<any> {
    return  this.http.get(this.url+`puesto/?idEstacion=${idEstacion}&ordering=id`);
  }

  updatePuesto(idPuesto: string|null, puesto: any): Observable<any> {
    return this.http.put(this.url+`puesto/${idPuesto}/`, puesto);
  }
}
