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
import { ConexionesModalComponent } from "../conexiones-modal/conexiones-modal.component";
import {ConexionesService} from "../conexiones.service";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  patinetes: Patinete[] = [];
  estaciones: Estacion[] = [];
  puestos: Puesto[] = [];
  idEstacion!: any;
  estacionSeleccionada!: any;
  // patineteSeleccionado!: any;
  formulario!: FormGroup;
  mostrarDatos = false;
  conexiones: any;

  constructor(
    private perfilService: PerfilService,
    private patinetesService: PatinetesService,
    private estacionesService: EstacionesService,
    private conexionesService: ConexionesService,
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
      estaciones: ['Seleccione...', Validators.required],
    });

    this.conexionesService.getConexiones(id).subscribe(conexiones => {
      this.conexiones = conexiones;
    })
  }

  mostrarPuestos(): void {
    this.idEstacion = this.formulario.get('estaciones')!.value;
    this.estacionSeleccionada = this.estaciones.find(estacion => estacion.id == this.idEstacion);
    const estacionActual = this.estacionSeleccionada ? this.estacionSeleccionada.nombre : null;

    if (estacionActual != null) {
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
    const modalRef = this.modalService.open(ConexionesModalComponent);
    modalRef.componentInstance.puesto = puesto;
    modalRef.componentInstance.patinetesList = this.patinetes;
    modalRef.componentInstance.estacion = this.estacionSeleccionada;
  }

}
