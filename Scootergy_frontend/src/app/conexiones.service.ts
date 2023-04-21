import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Conexion} from "./conexion";

@Injectable({
  providedIn: 'root'
})
export class ConexionesService {

  constructor(
    private http: HttpClient,
  ) { }

  getConexiones(userId: string|null): Observable<any> {
    return this.http.get(`http://127.0.0.1:8000/conexion/?idUsuario=${userId}`);
  }

  getConexionesMes(userId: string|null){
    const mes = new Date().getMonth() + 1;
    console.log(`http://127.0.0.1:8000/conexion/?idUsuario=${userId}&mes=${mes}`)
    return this.http.get(`http://127.0.0.1:8000/conexion/?idUsuario=${userId}&mes=${mes}`);
  }

  postConexion(conexion: any): Observable<any> {
    console.log(conexion)
    return this.http.post<any>(`http://127.0.0.1:8000/conexion/`, conexion);
  }

}
