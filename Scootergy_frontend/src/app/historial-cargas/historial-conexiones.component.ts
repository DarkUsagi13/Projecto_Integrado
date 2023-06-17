import {Component, OnInit, ViewChild} from '@angular/core';
import {UsuariosService} from '../usuarios.service';
import {ConexionesService} from '../conexiones.service';
import {BusquedasService} from '../busquedas.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {calcular_tiempo, formatearFecha} from "../utils";
import {ConexionMasTiempo} from "../conexion";

@Component({
  selector: 'app-historial-conexiones',
  templateUrl: './historial-conexiones.component.html',
  styleUrls: ['./historial-conexiones.component.scss'],
})
export class HistorialConexionesComponent implements OnInit {

  formulario!: FormGroup;

  dataSource!: MatTableDataSource<any>;

  conexiones: ConexionMasTiempo[] = [];


  columnsToDisplay: string[] = [
    'patineteNombre',
    'estacionNombre',
    'puestoId',
    'horaConexion',
    'horaDesconexion',
    'tiempoTotal',
    'consumo',
    'importe',
    'detalles',
  ];

  itemsPerPage = 10;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private usuariosService: UsuariosService,
    private conexionesService: ConexionesService,
    private busquedaService: BusquedasService,
    private fb: FormBuilder,
  ) {

    this.formulario = this.fb.group({
      patinete: new FormControl(''),
      estacion: new FormControl(''),
      desde: new FormControl({value: '', disabled: true}),
      hasta: new FormControl({value: '', disabled: true}),
    })
  }

  ngOnInit() {
    this.buscarConexionesPersonales();
    this.formulario.valueChanges.subscribe(() => {
      this.buscarConexionesPersonales();
    })
  }

  buscarConexionesPersonales() {
    const userId = this.usuariosService.obtenerIdUsuario();

    const patinete = this.formulario.get('patinete')?.value;
    const estacion = this.formulario.get('estacion')?.value;
    const fecha_inicio: string = formatearFecha(this.formulario.get('desde')?.value);
    const fecha_fin: string = formatearFecha(this.formulario.get('hasta')?.value);

    this.busquedaService.buscarConexiones(userId, 'true', patinete, estacion, fecha_inicio.toString(), fecha_fin).subscribe((response) => {
      if (response.status === 200) {
        this.conexiones = [];
        for (const c of response.body) {
          c.tiempoTotal = calcular_tiempo(c)
          this.conexiones.push(c)
        }
        this.dataSource = new MatTableDataSource(this.conexiones);
        this.dataSource.paginator = this.paginator;
        this.paginator._intl.itemsPerPageLabel = 'Items por página';
        this.dataSource.sort = this.sort;
      }
    });
  }

}
