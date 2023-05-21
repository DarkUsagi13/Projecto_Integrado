import { Component, OnInit } from '@angular/core';
import { ConexionesService } from "../conexiones.service";
import { PerfilService } from "../perfil.service";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";

@Component({
  selector: 'app-historial-conexiones',
  templateUrl: './historial-conexiones.component.html',
  styleUrls: ['./historial-conexiones.component.scss']
})
export class HistorialConexionesComponent implements OnInit {
  listaConexiones: any[] = [];
  conexionesFiltradas: any[] = [];
  filtros: any = {};
  valoresForm!: FormGroup;
  conexionesPaginadas: any[] = [];

  paginaActual = 1; // Página actual
  itemsPorPagina = 10; // Cantidad de elementos por página
  totalConexiones = 0; // Total de conexiones

  filtroSeleccionado: string | null = null;
  ordenSeleccionado: string | null = null;

  constructor(
    private perfilService: PerfilService,
    private conexionesService: ConexionesService,
    private fb: FormBuilder,
  ) {
    this.filtros = {
      1: 'Patinete',
      2: 'Puesto',
      3: 'Consumo',
      4: 'Hora de conexión',
      5: 'Hora de Desconexión',
      6: 'Importe'
    };
  }

  ngOnInit() {
    this.valoresForm = this.fb.group({
      filtros: new FormControl(''), // Establece la opción predeterminada como 'Hora de conexión'
      orden: new FormControl('Ascendente'),
    });

    this.valoresForm.valueChanges.subscribe(() => {
      this.valoresFormValueChanged();
    });

    this.obtenerConexiones();
  }

  obtenerConexiones() {
    const userId = this.perfilService.obtenerIdUsuario();
    this.filtroSeleccionado = this.valoresForm.get('filtros')?.value;
    this.ordenSeleccionado = this.valoresForm.get('orden')?.value;

    this.conexionesService.getConexionesFinalizadas(userId).subscribe(conexiones => {
      this.listaConexiones = conexiones;
      this.totalConexiones = conexiones.length;
      this.aplicarFiltroOrdenamiento();
      this.realizarPaginacion();
    });
  }

  realizarPaginacion() {
    const startIndex = (this.paginaActual - 1) * this.itemsPorPagina;
    const endIndex = startIndex + this.itemsPorPagina;
    this.conexionesPaginadas = this.conexionesFiltradas.slice(startIndex, endIndex);
  }

  aplicarFiltroOrdenamiento() {
    if (this.filtroSeleccionado !== null && this.ordenSeleccionado !== null) {
      const filtro = parseInt(this.filtroSeleccionado, 10);
      const orden = this.ordenSeleccionado;

      let conexionesFiltradasOrdenadas = [...this.listaConexiones];

      switch (filtro) {
        case 1:
          conexionesFiltradasOrdenadas = conexionesFiltradasOrdenadas.sort((a, b) =>
            this.compararPropiedadString(a, b, 'patineteNombre')
          );
          break;
        case 2:
          conexionesFiltradasOrdenadas = conexionesFiltradasOrdenadas.sort((a, b) =>
            this.compararPropiedadNumber(a, b, 'datosPuesto.id')
          );
          break;
        case 3:
          conexionesFiltradasOrdenadas = conexionesFiltradasOrdenadas.sort((a, b) =>
            this.compararPropiedadNumber(a, b, 'consumo')
          );
          break;
        case 4:
          conexionesFiltradasOrdenadas = conexionesFiltradasOrdenadas.sort((a, b) =>
            this.compararPropiedadString(a, b, 'horaConexion')
          );
          break;
        case 5:
          conexionesFiltradasOrdenadas = conexionesFiltradasOrdenadas.sort((a, b) =>
            this.compararPropiedadString(a, b, 'horaDesconexion')
          );
          break;
        case 6:
          conexionesFiltradasOrdenadas = conexionesFiltradasOrdenadas.sort((a, b) =>
            this.compararPropiedadNumber(a, b, 'monto')
          );
          break;
        default:
          break;
      }

      if (orden === 'Descendente') {
        conexionesFiltradasOrdenadas.reverse();
      }

      this.conexionesFiltradas = conexionesFiltradasOrdenadas;
    } else {
      this.conexionesFiltradas = [...this.listaConexiones];
    }
  }

  compararPropiedadString(a: any, b: any, propiedad: string): number {
    const valorA = a[propiedad];
    const valorB = b[propiedad];
    if (valorA < valorB) {
      return -1;
    }
    if (valorA > valorB) {
      return 1;
    }
    return 0;
  }

  compararPropiedadNumber(a: any, b: any, propiedad: string): number {
    return a[propiedad] - b[propiedad];
  }

  valoresFormValueChanged() {
    this.filtroSeleccionado = this.valoresForm.get('filtros')?.value;
    this.ordenSeleccionado = this.valoresForm.get('orden')?.value;
    this.aplicarFiltroOrdenamiento();
    this.paginaActual = 1; // Restablece la página actual a 1 al cambiar el filtro o el orden
    this.realizarPaginacion();
  }
}
