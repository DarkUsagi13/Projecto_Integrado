import {Component, OnDestroy, OnInit} from '@angular/core';
import {ConexionesService} from "../conexiones.service";
import {UsuariosService} from "../usuario.service";
import {PaypalService} from "../paypal.service";
import {ActivatedRoute} from "@angular/router";
import {calcular_tiempo} from "../utils";
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

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

  openPDF(): void {
    let DATA: any = document.getElementById('miTarjeta');
    html2canvas(DATA).then((canvas) => {
      let fileWidth = 208;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILEURI = canvas.toDataURL('image/png');
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
      PDF.save('resumen_pago.pdf');
    });
  }

  ngOnDestroy() {
    localStorage.removeItem('conexion')
  }

}
