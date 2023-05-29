import {Component} from '@angular/core';
import {UsuariosService} from "../usuarios.service";
import {ConexionesService} from "../conexiones.service";
import {EstacionesService} from "../estaciones.service";

@Component({
  selector: 'app-administrador',
  templateUrl: './administrador.component.html',
  styleUrls: ['./administrador.component.scss']
})
export class AdministradorComponent {

  totalUsuarios: any = {};
  usuariosActivos: any = {};
  usuariosInactivos: any = {};
  gasto_total: any = {};
  consumo_total: any = {};

  estacionesActivas: any = {};
  estacionesInactivas: any = {};

  constructor(
    private usuariosService: UsuariosService,
    private estacionesService: EstacionesService,
  ) {



  }

  ngOnInit() {

    this.usuariosService.estadisticas_usuarios().subscribe(response => {
      if (response.status == 200) {
        this.totalUsuarios = response.body.total_usuarios;
        this.usuariosActivos = response.body.usuarios_con_conexion_activa;
        this.usuariosInactivos = response.body.usuarios_sin_conexion;
      }
    })

    this.usuariosService.estadisticas_totales().subscribe(response => {
      if (response.status == 200) {
        this.gasto_total = response.body.gasto_total;
        this.consumo_total = response.body.consumo_total;
      }
    })

    this.estacionesService.estadisticas_estaciones().subscribe(response => {
      if (response.status == 200) {
        this.estacionesActivas = response.body.estaciones_activas;
        this.estacionesInactivas = response.body.estaciones_inactivas;
      }
    })

  }
}
