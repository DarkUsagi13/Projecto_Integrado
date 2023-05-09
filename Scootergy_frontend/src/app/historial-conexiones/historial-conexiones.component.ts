import { Component } from '@angular/core';
import {ConexionesService} from "../conexiones.service";
import {PerfilService} from "../perfil.service";

@Component({
  selector: 'app-historial-conexiones',
  templateUrl: './historial-conexiones.component.html',
  styleUrls: ['./historial-conexiones.component.scss']
})
export class HistorialConexionesComponent {

  conexiones: any = {};

  constructor(
    private perfilService: PerfilService,
    private conexionesService: ConexionesService,
  ) {
  }

  ngOnInit() {
    this.conexionesService.getConexiones(this.perfilService.getLoggedInUser()).subscribe(conexiones => {
      this.conexiones = conexiones;
    })
  }

}
