import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Patinete} from "./patinete";
import {url} from "./utils";

@Injectable({
  providedIn: 'root'
})
export class PatinetesService {

  url: any = url()
  patineteSeleccionado: any;

  constructor(private http: HttpClient) { }

  getMarcas(): Observable<any> {
    return this.http.get<any>(this.url + `marca/`, {observe: 'response'})
  }

  getModelos(marca_id: string): Observable<any> {
    const params =  new HttpParams().set('marca', marca_id)
    return this.http.get<any>(this.url + `modelo/`, {params, observe: 'response'})
  }

  setPatineteSeleccionado(patinete: any) {
    return this.patineteSeleccionado = patinete;
  }

  patinetes(userId: string, patinete: string): Observable<any> {
    const params = new HttpParams().set('usuario', userId).set('patinete', patinete)
    return  this.http.get(this.url+`patinete/`, {params, observe: 'response'});
  }

  patinete(patinete_id: string):Observable<any> {
    const params = new HttpParams().set('id', patinete_id);
    return this.http.get(this.url+`patinete/`, {params})
  }

  registrarPatinete(patinete: Patinete): Observable<any> {
    return this.http.post<any>(this.url+'patinete/', patinete, {observe: 'response'});
  }

  puttPatinete(patinete_id: any, patinete: Patinete): Observable<any> {
    return this.http.put<any>(this.url+`patinete/${patinete_id}/`, patinete, {observe: 'response'});
  }

  eliminarPatinete(patinete_id: string): Observable<any> {
    return this.http.delete<any>(this.url+`patinete/${patinete_id}`, {observe: 'response'})
  }

}
