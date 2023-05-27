import {Component, OnInit} from '@angular/core';
import {PerfilService} from "../perfil.service";
import {ConexionesService} from "../conexiones.service";

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})

export class ResumenPerfilComponent implements OnInit {
  perfilUsuario: any = {};
  usuarioId: string = "";
  listaUltimasConexiones: any = {};
  consumo_mes: any = {};
  gasto_mes: any = {};
  conexiones_mes : any;

  constructor(
    private perfilService: PerfilService,
    private conexionesService: ConexionesService
  ) {
  }

  ngOnInit(): void {
    this.usuarioId = this.perfilService.obtenerIdUsuario();
    this.perfilService.perfil(this.usuarioId).subscribe(perfilUsuario => {
      this.perfilUsuario = perfilUsuario;
    })

    this.conexionesService.consumoTotalMes(this.usuarioId).subscribe(consumo => {
      this.consumo_mes = consumo.consumo_total; // Acceder a la propiedad consumo_total
    });

    this.conexionesService.getConexionesFinalizadas(this.usuarioId, '-', '').subscribe(conexiones => {
      this.conexiones_mes = conexiones.length;
      // Seleccionar las últimas 5 conexiones
      this.listaUltimasConexiones = conexiones.slice(0, 5);
    });

    this.conexionesService.gastoTotalMes(this.usuarioId).subscribe(gasto_mes => {
      this.gasto_mes = gasto_mes.gasto_total;
    })

  }

}
