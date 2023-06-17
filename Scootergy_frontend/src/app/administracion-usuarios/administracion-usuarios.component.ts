import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {BusquedasService} from "../busquedas.service";
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {
  AdministracionDetallesUsuarioComponent
} from "../administracion-detalles-usuario/administracion-detalles-usuario.component";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {formatearFecha} from "../utils";

@Component({
  selector: 'app-administracion-usuarios',
  templateUrl: './administracion-usuarios.component.html',
  styleUrls: ['./administracion-usuarios.component.scss']
})
export class AdministracionUsuariosComponent {

  formulario!: FormGroup;

  dataSource!: MatTableDataSource<any>;

  columnsToDisplay: string[] = [
    'username',
    'email',
    'dated_joined',
    'is_staff',
    'editar',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  itemsPerPage = 10;


  constructor(
    private busquedaService: BusquedasService,
    private fb: FormBuilder,
    private modalService: NgbModal,
  ) {
    this.formulario = this.fb.group({
      username: new FormControl(''),
      email: new FormControl(''),
      desde: new FormControl({value: '', disabled: true}),
      hasta: new FormControl({value: '', disabled: true}),
    })
  }

  ngOnInit() {
    this.buscarUsuarios();
    this.formulario.valueChanges.subscribe(() => {
        this.buscarUsuarios();
      }
    )
  }

  buscarUsuarios() {
    const usuario = this.formulario.get('username')?.value;
    const email = this.formulario.get('email')?.value;
    const fecha_inicio: string = formatearFecha(this.formulario.get('desde')?.value);
    const fecha_fin: string = formatearFecha(this.formulario.get('hasta')?.value);
    this.busquedaService.buscarUsuarios(usuario, email, fecha_inicio, fecha_fin).subscribe(usuarios => {
      if (usuarios.status == 200) {
          this.dataSource = new MatTableDataSource(usuarios.body);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.paginator._intl.itemsPerPageLabel = 'Items por página';
      }
    })

  }

  open(usuario: any) {
    let modalRef = this.modalService.open(AdministracionDetallesUsuarioComponent)
    modalRef.componentInstance.usuario = usuario;

    modalRef.componentInstance.usuarioActualizado.subscribe((data: boolean) => {
      if (data) {
          this.buscarUsuarios();
      }
    });
  }

}
