import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Patinete} from "./patinete";

@Injectable({
  providedIn: 'root'
})
export class PatinetesService {

  constructor(private http: HttpClient) { }

  setUsuario(id: string) {
    return `https://127.0.0.1:8000/usuario/${id}/`
  }

  patinetes(userId: string|null): Observable<any> {
    return  this.http.get(`http://127.0.0.1:8000/patinete/?idUsuario=${userId}`);
  }

  postPatinete(patinete: Patinete): Observable<any> {
    return this.http.post<any>('http://localhost:8000/patinete/', patinete);
  }

  puttPatinete(patinete: Patinete): Observable<any> {
    return this.http.put<any>('http://localhost:8000/patinete/', patinete);
  }

}
