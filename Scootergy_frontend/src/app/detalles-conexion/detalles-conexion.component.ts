import {Component, OnInit} from '@angular/core';
import {PerfilService} from "../perfil.service";
import {ConexionesService} from "../conexiones.service";
import {ActivatedRoute, Router} from "@angular/router";
import {calcular_tiempo} from "../utils";

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
    private perfilService: PerfilService,
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

}
