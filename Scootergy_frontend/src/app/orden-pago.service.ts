import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class OrdenPagoService {

  constructor(private http: HttpClient) { }

  createPayment(): Observable<any> {
    const url = 'http://localhost:8000/api/create-payment/';
    const data = { /* Agrega aquí los datos que necesitas para crear la orden de pago */ };
    return this.http.post(url, data);
  }

}
