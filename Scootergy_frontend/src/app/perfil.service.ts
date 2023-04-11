import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PerfilService {

  constructor(private http: HttpClient) { }

  getLoggedInUser() {
    const usuario = JSON.parse(localStorage.getItem('userData')!);
    return usuario.id;
  }

  perfil(userId: string|null): Observable<any> {
    return this.http.get(`http://127.0.0.1:8000/usuario/${userId}/`);
  }

  putPerfil(userId: string|null, usuario: any): Observable<any> {
    return this.http.put(`http://127.0.0.1:8000/usuario/${userId}/`, usuario);
  }

}
