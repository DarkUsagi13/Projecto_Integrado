import { Injectable } from '@angular/core';
import {url} from "./utils";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProvinciasService {

  url: any = url()

  constructor(private http: HttpClient) { }

  getProvincias(comunidad_id: string): Observable<any> {
    const params = new HttpParams().set('comunidad_autonoma', comunidad_id)
    return this.http.get(this.url + `provincia`, {params, observe: 'response'})
  }

  getComunidades(): Observable<any> {
    return this.http.get(this.url + `comunidad_autonoma`, {observe: 'response'})
  }

}
