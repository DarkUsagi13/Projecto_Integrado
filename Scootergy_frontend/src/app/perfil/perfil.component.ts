import {Component, OnInit} from '@angular/core';
import {PerfilService} from "../perfil.service";
import {ConexionesService} from "../conexiones.service";

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})

export class PerfilComponent implements OnInit {
  perfilUsuario: any = {};
  usuarioId: string = "";
  listaUltimasConexiones: any = {};
  consumo_mes: any = {};
  gasto_mes: any = {};
  conexionesOrdenadas: any = {};

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

    this.conexionesService.getConexionesFinalizadas(this.usuarioId).subscribe(conexiones => {
      // Ordenar conexiones por fecha de conexión en orden descendente
      conexiones.sort((a: { horaConexion: string | number | Date; }, b: { horaConexion: string | number | Date; }) => new Date(b.horaConexion).getTime() - new Date(a.horaConexion).getTime());

      // Seleccionar las últimas 5 conexiones
      this.listaUltimasConexiones = conexiones.slice(0, 5);
      console.log(this.listaUltimasConexiones)
    });



    this.conexionesService.gastoTotalMes(this.usuarioId).subscribe(gasto_mes => {
      this.gasto_mes = gasto_mes.gasto_total;
    })

  }

}
