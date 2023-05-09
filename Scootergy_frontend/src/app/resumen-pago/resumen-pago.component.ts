import { Component } from '@angular/core';
import {ConexionesService} from "../conexiones.service";
import {PerfilService} from "../perfil.service";
import {PaypalService} from "../paypal.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-resumen-pago',
  templateUrl: './resumen-pago.component.html',
  styleUrls: ['./resumen-pago.component.scss']
})
export class ResumenPagoComponent {

  public conexion: any;
  public perfil: any;
  public paymentId: any;
  public payerId: any;

  constructor(
    private conexionService: ConexionesService,
    private perfilService: PerfilService,
    private paypalService: PaypalService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.conexion = this.conexionService.conexionActual.id
    this.conexionService.getConexion(this.conexion)
    this.perfil = this.perfilService.perfil(this.perfilService.getLoggedInUser())
    this.route.queryParams.subscribe(params => {
      this.paymentId = params['paymentId'];
      this.payerId = params['PayerID'];
      this.capturarPago(this.paymentId, this.payerId)
    });

  }

  capturarPago(pagoId: any, payerId: string) {
    this.paypalService.capturarPago(pagoId, payerId).subscribe(
      (response: any) => {
        console.log(response);
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

}
