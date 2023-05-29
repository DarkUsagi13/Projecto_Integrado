import {Component, OnInit} from '@angular/core';
import {UsuariosService} from "../usuarios.service";
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
    private usuariosService: UsuariosService,
    private conexionesService: ConexionesService
  ) {
  }

  ngOnInit(): void {
    this.usuarioId = this.usuariosService.obtenerIdUsuario();
    this.usuariosService.perfil(this.usuarioId).subscribe(perfilUsuario => {
      this.perfilUsuario = perfilUsuario;
    })

    const mes = new Date().getMonth() + 1;


    this.conexionesService.gasto_y_consumo_total(this.usuarioId, mes).subscribe(gastoYConsumoMes => {
      this.consumo_mes = gastoYConsumoMes.consumo_total; // Acceder a la propiedad consumo_total
      this.gasto_mes = gastoYConsumoMes.gasto_total;
    });

    this.conexionesService.getConexionesFinalizadas(this.usuarioId, '-', '').subscribe(conexiones => {
      this.conexiones_mes = conexiones.length;
      // Seleccionar las últimas 5 conexiones
      this.listaUltimasConexiones = conexiones.slice(0, 5);
    });

  }

}
