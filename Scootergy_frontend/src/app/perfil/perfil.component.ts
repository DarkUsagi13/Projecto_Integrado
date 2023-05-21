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
  conexiones: any = {};
  usuarioId: string = "";
  conexionesMes: any = {};
  consumo_mes: any = {};
  gasto_mes: any = {};
  conexionesOrdenadas: any = {};

  constructor(
    private perfilService: PerfilService,
    private conexionesService: ConexionesService
  ) {
  }

  ngOnInit(): void {
    this.usuarioId = this.perfilService.getLoggedInUser();
    this.perfilService.perfil(this.usuarioId).subscribe(perfilUsuario => {
      this.perfilUsuario = perfilUsuario;
    })

    this.conexionesService.consumoTotalMes(this.usuarioId).subscribe(consumo => {
      this.consumo_mes = consumo.consumo_total; // Acceder a la propiedad consumo_total
    });

    const totalPages = 100; // Establece el número total de páginas
    for (let page = 1; page <= totalPages; page++) {
      this.conexionesService.getConexionesFinalizadas(this.perfilService.getLoggedInUser(), page).subscribe(conexiones => {
        this.conexiones = conexiones;
      });
    }

    this.conexionesService.getConexionesMes(this.usuarioId).subscribe(conexiones => {
      this.conexionesMes = conexiones;
      this.conexionesOrdenadas = this.conexionesMes.sort((a: { horaConexion: string | number | Date; }, b: { horaConexion: string | number | Date; }) => {
        // Comparar las propiedades horaConexion de cada elemento
        const fechaA = new Date(a.horaConexion);
        const fechaB = new Date(b.horaConexion);
        return fechaA.getTime() - fechaB.getTime();
      });
      // conexionesOrdenadas ahora contiene la lista ordenada por horaConexion
    });

    this.conexionesService.gastoTotalMes(this.usuarioId).subscribe(gasto_mes => {
      this.gasto_mes = gasto_mes.gasto_total;
    })


  }

}
