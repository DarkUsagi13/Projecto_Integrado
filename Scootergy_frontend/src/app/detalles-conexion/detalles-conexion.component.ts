import {Component, OnInit} from '@angular/core';
import {UsuariosService} from "../usuario.service";
import {ConexionesService} from "../conexiones.service";
import {ActivatedRoute} from "@angular/router";
import {calcular_tiempo} from "../utils";
import html2canvas from "html2canvas";
import {jsPDF} from "jspdf";

@Component({
  selector: 'app-detalles-conexion',
  templateUrl: './detalles-conexion.component.html',
  styleUrls: ['./detalles-conexion.component.scss']
})
export class DetallesConexionComponent implements OnInit {

  usuario: any;
  perfil: any;
  conexion: any = {};
  tiempoTotal: any;

  constructor(
    private perfilService: UsuariosService,
    private conexionesService: ConexionesService,
    private activateRoute: ActivatedRoute,
  ) {

    const userData = localStorage.getItem('userData')
    if (userData) {
      this.perfil = JSON.parse(userData).username
    }

    const conexion_id = this.activateRoute.snapshot.paramMap.get('id');
    if (conexion_id) {
      this.conexionesService.getConexionPagada(conexion_id).subscribe(conexion => {
        this.conexion = conexion[0];
        this.tiempoTotal = calcular_tiempo(this.conexion)
      })
    }

  }

  ngOnInit() {
    this.usuario = this.perfilService.obtenerIdUsuario();
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

}
