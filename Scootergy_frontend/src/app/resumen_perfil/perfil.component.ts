import {Component, OnInit} from '@angular/core';
import {UsuariosService} from "../usuario.service";
import {ConexionesService} from "../conexiones.service";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})

export class ResumenPerfilComponent implements OnInit {

  perfilUsuario: any = {};
  usuarioId: string = "";
  consumo_mes: any = {};
  gasto_mes: any = {};
  conexiones_mes : any;

  dataSource!: MatTableDataSource<any>;

  columnsToDisplay: string[] = [
    'patineteNombre',
    'consumo',
    'horaConexion',
    'importe',
  ];

  constructor(
    private usuariosService: UsuariosService,
    private conexionesService: ConexionesService
  ) {}

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
      if (Array.isArray(conexiones)) {
        this.conexiones_mes = conexiones.length;
        conexiones.sort((a: { horaConexion: string }, b: { horaConexion: string }) => {
          const fechaA = new Date(a.horaConexion);
          const fechaB = new Date(b.horaConexion);
          return fechaB.getTime() - fechaA.getTime();
        });
        // Seleccionar las últimas 5 conexiones
        this.dataSource = new MatTableDataSource<any>(conexiones.slice(0, 5));
      } else {
        // Manejar el caso en el que no se devuelvan conexiones
        this.conexiones_mes = 0;
        this.dataSource = new MatTableDataSource<any>([]);
      }
    });

  }

}
