import {Component, OnInit, ViewChild} from '@angular/core';
import {PatinetesService} from "../patinetes.service";
import {UsuariosService} from "../usuario.service";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {MatDialog} from '@angular/material/dialog';
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from "@angular/material/paginator";
import {ConfirmarBorrarModalComponent} from "../confirmar-borrar-modal/confirmar-borrar-modal.component";

@Component({
  selector: 'app-listado-patinetes',
  templateUrl: './listado-patinetes.component.html',
  styleUrls: ['./listado-patinetes.component.scss']
})
export class ListadoPatinetesComponent implements OnInit {

  formulario!: FormGroup;

  dataSource!: MatTableDataSource<any>;

  columnsToDisplay: string[] = [
    'patineteNombre',
    'consumo',
    'detalles',
  ];

  itemsPerPage = 10;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private usuariosService: UsuariosService,
    private patinetesServices: PatinetesService,
    private fb: FormBuilder,
    public dialog: MatDialog,
  ) {

    this.formulario = this.fb.group({
      patinete: new FormControl(''),
      consumo: new FormControl(''),
    });


  }

  ngOnInit() {
    this.formulario.valueChanges.subscribe(() => {
      this.buscarPatinetes();
    })
    this.buscarPatinetes();
  }

  buscarPatinetes() {

    const userId = this.usuariosService.obtenerIdUsuario()
    const patinete = this.formulario.get('patinete')?.value;

    this.patinetesServices.patinetes(userId, patinete).subscribe(response => {
      if (response.status == 200) {
        this.dataSource = new MatTableDataSource(response.body)
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      }
    })
  }

  open(patinete: any) {
    if (patinete) {
      let modalRef = this.dialog.open(ConfirmarBorrarModalComponent)
      modalRef.componentInstance.patinete = patinete;

      modalRef.componentInstance.actualizar.subscribe(value => {
        if (value) {
          this.buscarPatinetes()
        }
        modalRef.close()
      })
    }
  }

}
