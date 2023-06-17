import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {BusquedasService} from "../busquedas.service";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatDialog} from "@angular/material/dialog";
import {DetallesEstacionComponent} from "../detalles-estacion/detalles-estacion.component";
import {
  AdministracionRegistrarEstacionComponent
} from "../administracion-registrar-estacion/administracion-registrar-estacion.component";
import {AgregarPuestosEstacionComponent} from "../agregar-puestos-estacion/agregar-puestos-estacion.component";

@Component({
  selector: 'app-administracion-estaciones-carga',
  templateUrl: './administracion-estaciones-carga.component.html',
  styleUrls: ['./administracion-estaciones-carga.component.scss']
})
export class AdministracionEstacionesCargaComponent implements OnInit {

  formulario!: FormGroup;

  dataSource!: MatTableDataSource<any>;

  columnsToDisplay: string[] = [
    'nombre',
    'direccion',
    'provinciaNombre',
    'comunidadNombre',
    'total_puestos',
    'editar',
    'add_puestos',
  ];

  itemsPerPage = 10;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private busquedasService: BusquedasService,
  ) {
    this.formulario = this.fb.group({
      estacion: new FormControl(''),
      direccion: new FormControl(''),
      provincia: new FormControl(''),
      comunidad: new FormControl(''),
    });

  }

  ngOnInit() {

    this.buscarEstaciones();

    this.formulario.valueChanges.subscribe(() => {
      this.buscarEstaciones();
    })

  }

  buscarEstaciones() {

    const estacion = this.formulario.get('estacion')?.value;
    const direccion = this.formulario.get('direccion')?.value;
    const provincia = this.formulario.get('provincia')?.value;
    const comunidad = this.formulario.get('comunidad')?.value;

    this.busquedasService.buscarEstaciones(estacion, direccion, provincia, comunidad).subscribe(response => {
      if (response.status == 200) {
        console.log(response.body)
        this.dataSource = new MatTableDataSource(response.body);
        this.dataSource.paginator = this.paginator;
        this.paginator._intl.itemsPerPageLabel = 'Items por página';
        this.dataSource.sort = this.sort;
      }
    })
  }

  open(estacion: any) {
    let modalRef = this.dialog.open(DetallesEstacionComponent, {width: '500px',})
    modalRef.componentInstance.estacion = estacion;

    modalRef.componentInstance.actualizar.subscribe(value => {
      if (value) {
        this.buscarEstaciones()
      }
      modalRef.close()
    })
  }

  openRegistroEstacion() {
    let modalRef2 = this.dialog.open(AdministracionRegistrarEstacionComponent, {width: '500px',})

    modalRef2.componentInstance.actualizar.subscribe(value => {
      console.log(value)
      if (value) {
        this.buscarEstaciones()
      }
      modalRef2.close()
    })
  }

  openAgregarPuestos(estacion: any) {
    let modalRef3 = this.dialog.open(AgregarPuestosEstacionComponent, {width: '500px'})
    modalRef3.componentInstance.estacion = estacion;

    modalRef3.componentInstance.actualizar.subscribe(value => {
      if (value) {
        this.buscarEstaciones()
      }
      modalRef3.close()
    })

  }


}
