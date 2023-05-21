import {Component, OnDestroy, OnInit} from '@angular/core';
import {ConexionesService} from "../conexiones.service";
import {PerfilService} from "../perfil.service";
import {PaypalService} from "../paypal.service";
import {ActivatedRoute} from "@angular/router";
import {calcular_tiempo} from "../utils";

@Component({
  selector: 'app-resumen-pago',
  templateUrl: './resumen-pago.component.html',
  styleUrls: ['./resumen-pago.component.scss']
})
export class ResumenPagoComponent implements OnInit, OnDestroy {

  public conexion: any = {};
  public perfil: any;
  public paymentId: any;
  public payerId: any;
  public tiempoTotal: any;

  constructor(
    private perfilService: PerfilService,
    private conexionService: ConexionesService,
    private paypalService: PaypalService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {

    localStorage.setItem('resumenPago', 'false')

    const userData = localStorage.getItem('userData')
    if (userData) {
      this.perfil = JSON.parse(userData).username
    }
    this.route.queryParams.subscribe(params => {
      this.paymentId = params['token'];
      this.payerId = params['PayerID'];
      this.capturarPago(this.paymentId, this.payerId)
    });

    const c = localStorage.getItem('conexion')
    if (c) {
      this.conexionService.getConexionPagada(JSON.parse(c).id).subscribe(conexion => {
          if (conexion) {
            this.conexion = conexion[0];
            this.tiempoTotal = calcular_tiempo(this.conexion)
          }
        }
      )
    }

  }

  capturarPago(pagoId: any, payerId: string) {
    this.paypalService.capturarPago(pagoId, payerId).subscribe();
    // this.paypalService.capturarPago(pagoId, payerId).subscribe(
    //   (response: any) => {
    //     console.log(response);
    //   },
    //   (error: any) => {
    //     console.log(error);
    //   }
    // );
  }

  ngOnDestroy() {
    localStorage.removeItem('conexion')
  }

}
