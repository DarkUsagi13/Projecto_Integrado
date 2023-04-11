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

  setUrlConexion(userId: string) {
    return `http://127.0.0.1:8000/conexion/${userId}`;
  }

  getConexiones(userId: string|null): Observable<any> {
    return this.http.get(`http://127.0.0.1:8000/conexion/?idUsuario=${userId}`);
  }

  putConexion(userId: string|null, conexion: Conexion): Observable<any> {
    return this.http.put(`http://127.0.0.1:8000/conexion/${userId}/`, conexion);
  }

}
