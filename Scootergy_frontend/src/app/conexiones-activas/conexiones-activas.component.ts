import {Component, ViewChild} from '@angular/core';
import {UsuariosService} from "../usuarios.service";
import {BusquedasService} from "../busquedas.service";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {ConexionesService} from "../conexiones.service";
import {formatearFecha} from "../utils";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ConexionesModalComponent} from "../conexiones-modal/conexiones-modal.component";
import {EstacionesService} from "../estaciones.service";

@Component({
  selector: 'app-conexiones-activas',
  templateUrl: './conexiones-activas.component.html',
  styleUrls: ['./conexiones-activas.component.scss']
})
export class ConexionesActivasComponent {

  formulario!: FormGroup;

  dataSource!: MatTableDataSource<any>;

  columnsToDisplay: string[] = [
    'patineteNombre',
    'estacionNombre',
    'puestoId',
    'horaConexion',
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
    private modalService: NgbModal,
    private estacionesService: EstacionesService,
  ) {

    this.formulario = this.fb.group({
      patinete: new FormControl(''),
      estacion: new FormControl(''),
      desde: new FormControl({ value: '', disabled: true }),
      hasta: new FormControl({ value: '', disabled: true }),
    })

  }

  ngOnInit() {

    this.obtenerConexionesActivas()

    this.formulario.valueChanges.subscribe(() => {
      this.obtenerConexionesActivas()
    })

  }

  obtenerConexionesActivas() {

    const userId = this.usuariosService.obtenerIdUsuario();

    const patinete = this.formulario.get('patinete')?.value;
    const estacion = this.formulario.get('estacion')?.value;
    const fecha_inicio: string = formatearFecha(this.formulario.get('desde')?.value);
    const fecha_fin: string = formatearFecha(this.formulario.get('hasta')?.value);

    this.busquedaService.buscarConexionesActivas(userId, patinete, estacion, fecha_inicio.toString(), fecha_fin).subscribe((response) => {
      if (response.status === 200) {
        this.dataSource = new MatTableDataSource(response.body);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }

  open(conexion: any) {
    this.estacionesService.getPuesto(conexion.puestoId).subscribe(response => {
      if (response.status == 200) {
        const modalRef = this.modalService.open(ConexionesModalComponent);
        modalRef.componentInstance.puesto = response.body[0];
      }
    });
  }


}
