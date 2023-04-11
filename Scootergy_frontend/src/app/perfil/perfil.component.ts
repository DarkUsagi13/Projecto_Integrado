import {Component, OnInit} from '@angular/core';
import {PerfilService} from "../perfil.service";
import {ConexionesService} from "../conexiones.service";

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})

export class PerfilComponent implements OnInit {
  perfilUsuario: any = {};
  conexiones: any = {};
  usuarioId: string = "";

  constructor(
    private perfilService: PerfilService,
    private conexionService: ConexionesService
  ) {
  }

  ngOnInit(): void {
    this.usuarioId = this.perfilService.getLoggedInUser();
    this.perfilService.perfil(this.usuarioId).subscribe(perfilUsuario => {
      this.perfilUsuario = perfilUsuario;
    })

    this.conexionService.getConexiones(this.usuarioId).subscribe(conexiones =>{
      this.conexiones = conexiones;
      console.log(this.conexiones)
    })

  }

}
