import {Component, OnInit} from '@angular/core';
import {ConexionesService} from "../conexiones.service";
import {PerfilService} from "../perfil.service";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";

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
    // Calcula el índice de inicio en función de la página actual y la cantidad de elementos por página
    const startIndex = (this.paginaActual - 1) * this.itemsPorPagina;
    // Calcula el índice de fin sumando el índice de inicio y la cantidad de elementos por página
    const endIndex = startIndex + this.itemsPorPagina;

    // Obtiene una porción de los elementos filtrados utilizando los índices de inicio y fin
    this.conexionesPaginadas = this.conexionesFiltradas.slice(startIndex, endIndex);
  }


  aplicarFiltroOrdenamiento() {
    // Verifica si tanto el filtro como el ordenamiento están seleccionados
    if (this.filtroSeleccionado !== null && this.ordenSeleccionado !== null) {
      // Convierte el filtro seleccionado a un número entero
      const filtro = parseInt(this.filtroSeleccionado, 10);

      // Obtiene el valor del ordenamiento seleccionado
      const orden = this.ordenSeleccionado;

      // Crea una copia del arreglo de conexiones original
      let conexionesFiltradasOrdenadas = [...this.listaConexiones];

      // Realiza el ordenamiento y filtrado basado en el filtro seleccionado
      switch (filtro) {
        case 1:
          // Ordena las conexiones por la propiedad 'patineteNombre' en orden ascendente
          conexionesFiltradasOrdenadas = conexionesFiltradasOrdenadas.sort((a, b) =>
            this.compararPropiedadString(a, b, 'patineteNombre')
          );
          break;
        case 2:
          // Ordena las conexiones por la propiedad 'datosPuesto.id' en orden ascendente
          conexionesFiltradasOrdenadas = conexionesFiltradasOrdenadas.sort((a, b) =>
            this.compararPropiedadNumber(a, b, 'datosPuesto.id')
          );
          break;
        case 3:
          // Ordena las conexiones por la propiedad 'consumo' en orden ascendente
          conexionesFiltradasOrdenadas = conexionesFiltradasOrdenadas.sort((a, b) =>
            this.compararPropiedadNumber(a, b, 'consumo')
          );
          break;
        case 4:
          // Ordena las conexiones por la propiedad 'horaConexion' en orden ascendente
          conexionesFiltradasOrdenadas = conexionesFiltradasOrdenadas.sort((a, b) =>
            this.compararPropiedadString(a, b, 'horaConexion')
          );
          break;
        case 5:
          // Ordena las conexiones por la propiedad 'horaDesconexion' en orden ascendente
          conexionesFiltradasOrdenadas = conexionesFiltradasOrdenadas.sort((a, b) =>
            this.compararPropiedadString(a, b, 'horaDesconexion')
          );
          break;
        case 6:
          // Ordena las conexiones por la propiedad 'monto' en orden ascendente
          conexionesFiltradasOrdenadas = conexionesFiltradasOrdenadas.sort((a, b) =>
            this.compararPropiedadNumber(a, b, 'monto')
          );
          break;
        default:
          break;
      }

      // Verifica si el ordenamiento es 'Descendente' y revierte el arreglo si es necesario
      if (orden === 'Descendente') {
        conexionesFiltradasOrdenadas.reverse();
      }

      // Asigna el arreglo de conexiones ordenadas y filtradas al arreglo conexionesFiltradas
      this.conexionesFiltradas = conexionesFiltradasOrdenadas;
    } else {
      // Si no se han seleccionado filtro ni ordenamiento, se asigna una copia del arreglo original al arreglo conexionesFiltradas
      this.conexionesFiltradas = [...this.listaConexiones];
    }
  }


  /**
   * Función que compara propiedades de tipo string
   * @param a
   * @param b
   * @param propiedad
   * *@return {number} Devuelve -1, 1 o 0
   */
  compararPropiedadString(a: any, b: any, propiedad: string): number {
    const valorA = a[propiedad];
    const valorB = b[propiedad];

    // Compara los valores de las propiedades
    if (valorA < valorB) {
      return -1;
    }
    if (valorA > valorB) {
      return 1;
    }
    return 0;
  }


  /**
   * Función que compara propiedades de tipo numérico
   * @param a
   * @param b
   * @param propiedad
   * @return {number} Devuelve un valor positivo, negativo o 0
   */
  compararPropiedadNumber(a: any, b: any, propiedad: string): number {
    return a[propiedad] - b[propiedad];
  }

  valoresFormValueChanged() {
    // Obtiene el valor seleccionado del formulario para el filtro
    this.filtroSeleccionado = this.valoresForm.get('filtros')?.value;

    // Obtiene el valor seleccionado del formulario para el orden
    this.ordenSeleccionado = this.valoresForm.get('orden')?.value;

    // Aplica el filtro y el ordenamiento
    this.aplicarFiltroOrdenamiento();

    // Restablece la página actual a 1 al cambiar el filtro o el orden
    this.paginaActual = 1;

    // Realiza la paginación de los elementos
    this.realizarPaginacion();
  }

}
