import {Component, Input, OnInit} from '@angular/core';
import {PatinetesService} from "../patinetes.service";
import {PerfilService} from "../perfil.service";
import {Patinete} from "../patinete";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { realizarPaginacion } from "../../utils/paginar-utils";
import {ConfirmarBorrarModalComponent} from "../confirmar-borrar-modal/confirmar-borrar-modal.component";

@Component({
  selector: 'app-listado-patinetes',
  templateUrl: './listado-patinetes.component.html',
  styleUrls: ['./listado-patinetes.component.scss']
})
export class ListadoPatinetesComponent implements OnInit{

  listaPatinetes: Patinete[] = [];
  valoresForm!: FormGroup;
  filtros: any = {};
  orden: any = {};
  propiedadSeleccionada: string = '';
  ordenSeleccionado: string = '';
  listaPaginada: any[] = [];
  paginaActual = 1; // Página actual
  itemsPorPagina = 10; // Cantidad de elementos por página

  constructor(
    private perfilService: PerfilService,
    private patinetesServices: PatinetesService,
    private fb: FormBuilder,
    private modalService: NgbModal,
  ) {
    this.filtros = {
      1: 'ID',
      2: 'Marca',
      3: 'Modelo',
      4: 'Consumo',
    };
    this.orden = {
      '': 'Ascendente',
      '-': 'Descendente'
    };
  }

  ngOnInit() {

    this.valoresForm = this.fb.group({
      filtros: new FormControl('1'),
      orden: new FormControl(''),
    });

    this.propiedadSeleccionada = this.valoresForm.get('filtros')?.value;
    this.ordenSeleccionado = this.valoresForm.get('orden')?.value;

    this.valoresForm.valueChanges.subscribe(() => {
      this.propiedadSeleccionada = this.valoresForm.get('filtros')?.value
      this.ordenSeleccionado = this.valoresForm.get('orden')?.value
      this.obtenerPatinetes()
    })
    this.obtenerPatinetes();

  }

  obtenerPatinetes() {
    const userId = this.perfilService.obtenerIdUsuario()
    this.patinetesServices.patinetes(userId).subscribe(patinetes => {
      this.listaPatinetes = patinetes;
      this.listaPaginada = realizarPaginacion(patinetes, this.paginaActual, this.itemsPorPagina);
    })
  }

  open(patinete: any) {
    let modalRef = this.modalService.open(ConfirmarBorrarModalComponent)
    modalRef.componentInstance.patinete = patinete;
  }

}
