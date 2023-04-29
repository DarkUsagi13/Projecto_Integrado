import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {url} from "./utils";

@Injectable({
  providedIn: 'root'
})
export class PaypalService {

  url: any = url()

  constructor(
    private http: HttpClient,
  ) { }

  crearPago(conexion: any) {
    return this.http.post<any>(this.url+'crear-pago/', {conexion});
  }

  capturarPago(pagoID: string, payerId: string) {
    const body = {
      payment_id: pagoID,
      payer_id: payerId
    };
    return this.http.post(this.url+`capturar-pago/`, body);
  }

}
