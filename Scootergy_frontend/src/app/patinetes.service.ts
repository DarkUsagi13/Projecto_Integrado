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

  setPatineteSeleccionado(patinete: any) {
    return this.patineteSeleccionado = patinete;
  }

  patinetes(userId: string|null): Observable<any> {
    return  this.http.get(this.url+`patinete/?usuario=${userId}`, {observe: 'response'});
  }

  patinete(patinete_id: string):Observable<any> {
    const params = new HttpParams().set('id', patinete_id);
    return this.http.get(this.url+`patinete/`, {params})
  }

  registrarPatinete(patinete: Patinete): Observable<any> {
    return this.http.post<any>(this.url+'patinete/', patinete);
  }

  puttPatinete(patinete_id: any, patinete: Patinete): Observable<any> {
    return this.http.put<any>(this.url+`patinete/${patinete_id}/`, patinete);
  }

  eliminarPatinete(usuario_id: string, patinete_id: string): Observable<any> {
    // const params = new HttpParams().set('id', patinete_id);
    return this.http.delete<any>(this.url+`patinete/${patinete_id}`)
  }

}
