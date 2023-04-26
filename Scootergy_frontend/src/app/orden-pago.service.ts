import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class OrdenPagoService {

  constructor(private http: HttpClient) { }

  makePayment(paymentData: any, conexion: any): Observable<any> {
    console.log(conexion)
    return this.http.post<any>('http://localhost:8000/api/paypal/', {paymentData, conexion});
  }

}
