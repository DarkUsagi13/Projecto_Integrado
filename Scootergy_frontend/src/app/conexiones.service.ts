import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {url} from "./utils";

@Injectable({
  providedIn: 'root'
})
export class ConexionesService {

  public conexiones: any = {};
  public conexionActual: any = {};
  url: any = url()

  constructor(
    private http: HttpClient,
  ) {
  }

  getConexiones(userId: string | null): Observable<any> {
    return this.http.get(this.url+`conexion/?usuario=${userId}`);
  }

  getConexionesMes(userId: string | null): Observable<any> {
    const mes = new Date().getMonth() + 1;
    return this.http.get(this.url+`conexion/?usuario=${userId}&mes=${mes}`);
  }

  postConexion(conexion: any): Observable<any> {
    return this.http.post<any>(this.url+`conexion/`, conexion);
  }

  getConexion(idConexion: any) {
    return this.http.get(this.url+`conexion/${idConexion}`);
  }

  getConexionActual(usuario: any, puesto: any) {

    const conexionesNoFinalizadas = []

    if (!puesto.disponible) {
      this.conexionActual = this.conexiones.find((conexion: { puesto: any; }) => conexion.puesto == puesto.url)
      localStorage.setItem('conexion', JSON.stringify(this.conexionActual))
    } else {
      this.conexionActual = {}
    }
    setTimeout(() => {
      this.getConexiones(usuario).subscribe(conexiones => {
        this.conexiones = conexiones;
      })
    }, 1000);
  }

}
