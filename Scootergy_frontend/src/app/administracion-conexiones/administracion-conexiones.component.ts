import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {ConexionesService} from "../conexiones.service";
import {BusquedasService} from "../busquedas.service";
import {MatTableDataSource} from "@angular/material/table";
import {ConexionMasTiempo} from "../conexion";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {calcular_tiempo, formatearFecha} from "../utils";

@Component({
  selector: 'app-administracion-conexiones',
  templateUrl: './administracion-conexiones.component.html',
  styleUrls: ['./administracion-conexiones.component.scss']
})
export class AdministracionConexionesComponent {

  formulario!: FormGroup;

  dataSource!: MatTableDataSource<any>;

  conexiones: ConexionMasTiempo[] = [];


  columnsToDisplay: string[] = [
    'usuario',
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
    private conexionesService: ConexionesService,
    private busquedaService: BusquedasService,
    private fb: FormBuilder,
  ) {

    this.formulario = this.fb.group({
      username: new FormControl(''),
      patinete: new FormControl(''),
      estacion: new FormControl(''),
      desde: new FormControl({value: '', disabled: true}),
      hasta: new FormControl({value: '', disabled: true}),
    })
  }

  ngOnInit() {
    this.buscarConexiones();
    this.formulario.valueChanges.subscribe(() => {
      this.buscarConexiones();
    })
  }

  buscarConexiones() {
    const patinete = this.formulario.get('patinete')?.value;
    const estacion = this.formulario.get('estacion')?.value;
    const fecha_inicio: string = formatearFecha(this.formulario.get('desde')?.value);
    const fecha_fin: string = formatearFecha(this.formulario.get('hasta')?.value);

    this.busquedaService.buscarConexiones('', 'true', patinete, estacion, fecha_inicio.toString(), fecha_fin).subscribe((response) => {
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
