import { Component } from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {UsuariosService} from "../usuarios.service";
import {ConexionesService} from "../conexiones.service";
import {BusquedasService} from "../busquedas.service";
import {realizarPaginacion} from "../../utils/paginar-utils";

@Component({
  selector: 'app-administracion-conexiones',
  templateUrl: './administracion-conexiones.component.html',
  styleUrls: ['./administracion-conexiones.component.scss']
})
export class AdministracionConexionesComponent {

  listaConexiones: any[] = [];
  mostrarAnimacion: boolean = true;

  formularioBusquedas!: FormGroup;
  filtroBusqueda: any = '';
  ordenBusqueda: any = '';

  conexionesPaginadas: any[] = [];

  paginaActual = 1; // Página actual
  itemsPorPagina = 10; // Cantidad de elementos por página
  totalConexiones = 0; // Total de conexiones

  constructor(
    private usuariosService: UsuariosService,
    private conexionesService: ConexionesService,
    private fb: FormBuilder,
    private busquedaService: BusquedasService,
  ) {

    this.filtroBusqueda = {
      patinete: 'Patinete',
      puesto: 'Puesto',
      consumo: 'Consumo',
      horaConexion: 'Hora de conexión',
      horaDesconexion: 'Hora de desconexión',
      importe: 'Importe'
    };

    this.ordenBusqueda = {
      '': 'Ascendente',
      '-': 'Descendente'
    };

    this.formularioBusquedas = this.fb.group({
      barraBusqueda: new FormControl(''),
      filtroBusqueda: new FormControl('horaConexion'), // Establece la opción predeterminada como 'Hora de conexión'
      ordenBusqueda: new FormControl('')
    });

  }

  ngOnInit() {

    this.formularioBusquedas.valueChanges.subscribe((data) => {
      console.log(data)
      this.buscarConexiones()
    })

    this.buscarConexiones();

  }

  buscarConexiones() {
    const valor = this.formularioBusquedas.get('barraBusqueda')?.value;
    const orden = this.formularioBusquedas.get('ordenBusqueda')?.value;
    const filtro = this.formularioBusquedas.get('filtroBusqueda')?.value;
    // this.busquedaService
    //   .buscarConexiones('', valor, orden, filtro)
    //   .subscribe(response => {
    //     if (response.status == 200) {
    //       this.listaConexiones = response.body;
    //       this.totalConexiones = response.body.length;
    //       this.conexionesPaginadas = realizarPaginacion(response.body, this.paginaActual, this.itemsPorPagina);
    //       this.mostrarAnimacion = false;
    //     }
    //   });
  }

}
