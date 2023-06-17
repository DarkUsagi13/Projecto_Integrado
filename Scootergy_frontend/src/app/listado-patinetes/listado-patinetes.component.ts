import {Component, OnInit, ViewChild} from '@angular/core';
import {PatinetesService} from "../patinetes.service";
import {UsuariosService} from "../usuarios.service";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import { MatDialog } from '@angular/material/dialog';
import {MatTableDataSource} from "@angular/material/table";
import { MatSort } from '@angular/material/sort';
import {MatPaginator} from "@angular/material/paginator";
import {ConfirmarBorrarModalComponent} from "../confirmar-borrar-modal/confirmar-borrar-modal.component";

@Component({
  selector: 'app-listado-patinetes',
  templateUrl: './listado-patinetes.component.html',
  styleUrls: ['./listado-patinetes.component.scss']
})
export class ListadoPatinetesComponent implements OnInit{

  formulario!: FormGroup;

  dataSource!: MatTableDataSource<any>;

  animacion = true;

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
       setTimeout(() => {
         this.dataSource = new MatTableDataSource(response.body)
         this.dataSource.sort = this.sort;
         this.dataSource.paginator = this.paginator;
         this.animacion = false;
       }, 500)
     }
    })
  }

  open(patinete: any) {
    if (patinete) {
      let modalRef = this.dialog.open(ConfirmarBorrarModalComponent)
      modalRef.componentInstance.patinete = patinete;

      modalRef.componentInstance.actualizar.subscribe(value => {
        if (value) {
          this.animacion = true;
          setTimeout(() => {
            this.buscarPatinetes()
          }, 500)
        }
        this.animacion = false;
        modalRef.close()
      })
    }
  }

  // open(patinete: any) {
  //   const dialogRef = this.dialog.open(DetallesPatineteComponent, {
  //     width: '500px', // Personaliza el ancho del modal según tus necesidades
  //     // Puedes agregar más opciones de configuración según tus requerimientos
  //   });
  //
  //   dialogRef.componentInstance.patinete = patinete;
  //
  //   // Opcionalmente, puedes suscribirte al evento 'afterClosed' para realizar acciones después de que se cierre el modal
  //   dialogRef.afterClosed().subscribe(result => {
  //     // Lógica después de cerrar el modal
  //   });
  // }

}
