import {Component, OnDestroy, OnInit} from '@angular/core';
import {ConexionesService} from "../conexiones.service";
import {UsuariosService} from "../usuarios.service";
import {PaypalService} from "../paypal.service";
import {ActivatedRoute} from "@angular/router";
import {calcular_tiempo} from "../utils";

@Component({
  selector: 'app-resumen-pago',
  templateUrl: './resumen-pago.component.html',
  styleUrls: ['./resumen-pago.component.scss']
})
export class ResumenPagoComponent implements OnInit, OnDestroy {

  public conexion_id: any;
  public conexion: any = {};
  public perfil: any;
  public paymentId: any;
  public payerId: any;
  public tiempoTotal: any;
  public success: boolean = false;

  constructor(
    private usuariosService: UsuariosService,
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

    this.conexion_id = localStorage.getItem('conexion')
  }

  capturarPago(pagoId: any, payerId: string) {
    this.paypalService.capturarPago(pagoId, payerId).subscribe(response => {
      this.success = response.success
      if (this.success) {
        this.conexionService.getConexionPagada(this.conexion_id).subscribe(conexion => {
            if (conexion) {
              this.conexion = conexion[0];
              this.tiempoTotal = calcular_tiempo(this.conexion)
            }
          }
        )
      }
    });
  }

  ngOnDestroy() {
    localStorage.removeItem('conexion')
  }

}
