import {Component, OnInit} from '@angular/core';
import {ConexionesService} from "../conexiones.service";
import {PerfilService} from "../perfil.service";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-historial-conexiones',
  templateUrl: './historial-conexiones.component.html',
  styleUrls: ['./historial-conexiones.component.scss']
})
export class HistorialConexionesComponent implements OnInit {

  listaConexiones: any[] = [];
  filtros: any = {};
  orden: any = {}
  valoresForm!: FormGroup;
  conexionesPaginadas: any[] = [];

  paginaActual = 1; // Página actual
  itemsPorPagina = 10; // Cantidad de elementos por página
  totalConexiones = 0; // Total de conexiones

  propiedadSeleccionada: string = '';
  ordenSeleccionado: string = '';

  constructor(
    private perfilService: PerfilService,
    private conexionesService: ConexionesService,
    private fb: FormBuilder,
  ) {
    this.filtros = {
      'id': 'ID',
      'patinete': 'Patinete',
      'puesto': 'Puesto',
      'consumo': 'Consumo',
      'horaConexion': 'Hora de conexión',
      'horaDesconexion': 'Hora de Desconexión',
      'importe': 'Importe'
    };
    this.orden = {
      '': 'Ascendente',
      '-': 'Descendente',
    }

  }

  ngOnInit() {
    this.valoresForm = this.fb.group({
      filtros: new FormControl(''), // Establece la opción predeterminada como 'Hora de conexión'
      orden: new FormControl(''),
    });
    this.obtenerConexiones();
  }

  obtenerConexiones() {
    const userId = this.perfilService.obtenerIdUsuario();

    this.conexionesService.getConexionesFinalizadas(userId, this.ordenSeleccionado, this.propiedadSeleccionada).subscribe(conexiones => {
      this.listaConexiones = conexiones;
      this.realizarPaginacion();

    })

    this.valoresForm.valueChanges.subscribe(valores => {
      this.propiedadSeleccionada = valores.filtros;
      this.ordenSeleccionado = valores.orden

      this.conexionesService.getConexionesFinalizadas(userId, this.ordenSeleccionado, this.propiedadSeleccionada).subscribe(conexiones => {
        this.listaConexiones = conexiones;
        this.totalConexiones = conexiones.length;
        this.valoresForm.valueChanges.subscribe(valores => {
          this.propiedadSeleccionada = valores.filtros;
          this.ordenSeleccionado = valores.orden
        })
        this.realizarPaginacion();
      });

    })
  }

  realizarPaginacion() {
    // Calcula el índice de inicio en función de la página actual y la cantidad de elementos por página
    const startIndex = (this.paginaActual - 1) * this.itemsPorPagina;
    // Calcula el índice de fin sumando el índice de inicio y la cantidad de elementos por página
    const endIndex = startIndex + this.itemsPorPagina;

    // Obtiene una porción de los elementos filtrados utilizando los índices de inicio y fin
    this.conexionesPaginadas = this.listaConexiones.slice(startIndex, endIndex);
  }

}
