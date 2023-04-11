import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {Estacion} from '../estacion';
import {EstacionesService} from '../estaciones.service';
import {Patinete} from '../patinete';
import {PerfilService} from '../perfil.service';
import {Puesto} from '../puesto';
import {PatinetesService} from "../patinetes.service";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from "../modal/modal.component";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  patinetes: Patinete[] = [];
  estaciones: Estacion[] = [];
  puestos: Puesto[] = [];
  idEstacion!: any;
  estacionSeleccionada!: any;
  formulario!: FormGroup;
  mostrarDatos = false;

  constructor(
    private perfilService: PerfilService,
    private patinetesService: PatinetesService,
    private estacionesService: EstacionesService,
    private router: Router,
    private fb: FormBuilder,
    private modalService: NgbModal,
  ) {
  }

  ngOnInit(): void {
    const id = this.perfilService.getLoggedInUser();
    this.patinetesService.patinetes(id).subscribe((data: Patinete[]) => {
      this.patinetes = data;
      this.mostrarEstaciones()
    });
    this.formulario = this.fb.group({
      registro: ['Seleccione...', Validators.required],
    });
  }

  mostrarPuestos(): void {
    this.idEstacion = this.formulario.get('registro')!.value;
    this.estacionSeleccionada = this.estaciones.find(estacion => estacion.id == this.idEstacion);
    this.estacionSeleccionada = this.estacionSeleccionada ? this.estacionSeleccionada.nombre : null;

    if (this.estacionSeleccionada != null) {
      this.estacionesService.getPuestos(this.idEstacion).subscribe((data: Puesto[]) => {
        this.puestos = data;
      });
    }
  }

  mostrarEstaciones() {
    if (this.patinetes.length > 0) {
      this.estacionesService.getEstaciones().subscribe((estaciones: Estacion[]) => {
        this.estaciones = estaciones;
      })
      this.mostrarDatos = true;
    }

  }

  open(puesto: any) {
    const modalRef = this.modalService.open(ModalComponent);
    modalRef.componentInstance.puesto = puesto;
  }

}
