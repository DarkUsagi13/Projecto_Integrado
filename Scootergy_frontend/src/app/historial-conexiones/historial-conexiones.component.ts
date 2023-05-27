import { Component, OnInit } from '@angular/core';
import { PerfilService } from '../perfil.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { realizarPaginacion } from "../../utils/paginar-utils";
import {ConexionesService} from "../conexiones.service";
import {BusquedasService} from "../busquedas.service";

@Component({
  selector: 'app-historial-conexiones',
  templateUrl: './historial-conexiones.component.html',
  styleUrls: ['./historial-conexiones.component.scss']
})
export class HistorialConexionesComponent implements OnInit {
  listaConexiones: any[] = [];

  formularioBusquedas!: FormGroup;
  valorBusqueda: string = '';
  filtroBusqueda: any = '';
  ordenBusqueda: any = '';

  conexionesPaginadas: any[] = [];

  paginaActual = 1; // Página actual
  itemsPorPagina = 10; // Cantidad de elementos por página
  totalConexiones = 0; // Total de conexiones

  propiedadSeleccionada = '';
  ordenSeleccionado = '';

  constructor(
    private perfilService: PerfilService,
    private conexionesService: ConexionesService,
    private fb: FormBuilder,
    private busquedaService: BusquedasService,
  ) {
    this.filtroBusqueda = {
      id: 'ID',
      patinete: 'Patinete',
      puesto: 'Puesto',
      consumo: 'Consumo',
      horaConexion: 'Hora de conexión',
      horaDesconexion: 'Hora de Desconexión',
      importe: 'Importe'
    };
    this.ordenBusqueda = {
      '': 'Ascendente',
      '-': 'Descendente'
    };
  }

  ngOnInit() {
    this.formularioBusquedas = this.fb.group({
      barraBusqueda: new FormControl(''),
      filtroBusqueda: new FormControl('horaConexion'), // Establece la opción predeterminada como 'Hora de conexión'
      ordenBusqueda: new FormControl('')
    });

    this.propiedadSeleccionada = this.formularioBusquedas.get('filtros')?.value;
    this.ordenSeleccionado = this.formularioBusquedas.get('orden')?.value;

    this.formularioBusquedas.valueChanges.subscribe(() => {
      this.propiedadSeleccionada = this.formularioBusquedas.get('filtros')?.value
      this.ordenSeleccionado = this.formularioBusquedas.get('orden')?.value
      this.buscarConexionesPersonales()
    })
    this.buscarConexionesPersonales();
  }

  buscarConexionesPersonales() {
    const userId = this.perfilService.obtenerIdUsuario();
    const valor = this.formularioBusquedas.get('barraBusqueda')?.value;
    const orden = this.formularioBusquedas.get('ordenBusqueda')?.value;
    const filtro = this.formularioBusquedas.get('filtroBusqueda')?.value;
    this.busquedaService
      .buscarConexionesPersonales(userId, valor, orden, filtro)
      .subscribe(conexiones => {
        this.listaConexiones = conexiones;
        this.totalConexiones = conexiones.length;
        this.conexionesPaginadas = realizarPaginacion(conexiones, this.paginaActual, this.itemsPorPagina);
      });
  }
}
