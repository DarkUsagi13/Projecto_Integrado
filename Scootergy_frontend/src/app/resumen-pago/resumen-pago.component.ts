import { Component } from '@angular/core';
import {ConexionesService} from "../conexiones.service";
import {PerfilService} from "../perfil.service";

@Component({
  selector: 'app-resumen-pago',
  templateUrl: './resumen-pago.component.html',
  styleUrls: ['./resumen-pago.component.scss']
})
export class ResumenPagoComponent {

  public conexion: any;
  public perfil: any;

  constructor(
    private conexionService: ConexionesService,
    private perfilService: PerfilService,
  ) {
  }

  ngOnInit() {
    this.conexion = this.conexionService.conexionActual.id
    this.conexionService.getConexion(this.conexion)
    this.perfil = this.perfilService.perfil(this.perfilService.getLoggedInUser())
  }


}
