import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {url} from "./utils";

@Injectable({
  providedIn: 'root'
})
export class PerfilService {

  url: any = url()
  constructor(private http: HttpClient) { }

  getLoggedInUser() {
    const usuario = JSON.parse(localStorage.getItem('userData')!);
    if (usuario) {
      return usuario.id
    }
    return 'Usuario no encontrado';
  }

  perfil(userId: string|null): Observable<any> {
    return this.http.get(this.url+`usuario/${userId}/`);
  }

  putPerfil(userId: string|null, usuario: any): Observable<any> {
    return this.http.put(this.url+`usuario/${userId}/`, usuario);
  }

}
