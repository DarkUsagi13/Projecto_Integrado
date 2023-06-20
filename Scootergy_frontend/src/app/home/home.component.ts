import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {Estacion} from '../estacion';
import {EstacionesService} from '../estaciones.service';
import {Patinete} from '../patinete';
import {UsuariosService} from '../usuario.service';
import {Puesto} from '../puesto';
import {PatinetesService} from "../patinetes.service";
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ConexionesModalComponent} from "../conexiones-modal/conexiones-modal.component";
import {ConexionesService} from "../conexiones.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  // Variables necesarias para el componente
  patinetes: Patinete[] = [];
  num_patinetes: any = 0;
  estaciones: Estacion[] = [];
  puestos: Puesto[] = [];
  estacion!: any;
  estacionSeleccionada!: any;
  formulario!: FormGroup;
  mostrarDatos = false;
  mostrarAnimacion: boolean = false;
  usuario: any;
  conexionesActivas: any = [];

  animacionCarga: boolean = true;

  constructor(
    private usuariosService: UsuariosService,
    private patinetesService: PatinetesService,
    private estacionesService: EstacionesService,
    public conexionesService: ConexionesService,
    private router: Router,
    private fb: FormBuilder,
    private modalService: NgbModal,
  ) {
  }

  ngOnInit(): void {
    //Se obtiene el ID del usuario autenticado
    this.usuario = this.usuariosService.obtenerIdUsuario();

    //Formulario para mostrar las estaciones
    this.formulario = this.fb.group({
      estaciones: ['Seleccione...', Validators.required],
    });
    this.getPatinetes()
    this.getConexionesActivas()

  }

  getPatinetes() {
    //Se obtienen los patinetes del usuario autenticado y llama a la función mostrarEstaciones()
    this.patinetesService.patinetes(this.usuario, '').subscribe((response) => {
      if (response.status == 200) {
        this.num_patinetes = response.body.length
        this.patinetes = response.body;
        this.mostrarEstaciones();
        this.animacionCarga = false;
      }
    });
  }

  getConexionesActivas() {
    //Se obtienen las conexiones activas del usuario autenticado
    this.conexionesService.getConexionesActivas(this.usuario).subscribe(conexiones => {
      this.conexionesService.conexionesActivas = conexiones.body; // Almacenar los resultados en un array

      for (const c of conexiones.body) {
        const existe = this.conexionesActivas.some((obj: {
          estacionNombre: any;
        }) => obj.estacionNombre === c.estacionNombre);
        if (!existe) {
          this.conexionesActivas.push(c);
        }
      }
    });
  }

  //Función para mostrar los puestos de una determinada estación
  mostrarPuestos(): void {
    let puestosModificados: Puesto[] = []
    this.mostrarAnimacion = false;
    this.animacionCarga = true;
    //Se guarda el valor de la estación seleccionada en el formulario
    this.estacion = this.formulario.get('estaciones')!.value;
    //Filtro para obtener la estación seleccionada de la lista de estaciones
    this.estacionSeleccionada = this.estaciones.find(estacion => estacion.id == this.estacion);
    //Expresión ternaria para obtener el nombre de la estación seleccionada para mostrarlo en la plantilla
    const estacionActual = this.estacionSeleccionada ? this.estacionSeleccionada.nombre : null;
    //Comprobamos que el nombre de la estación no sea "null"
    if (estacionActual != null) {
      this.mostrarAnimacion = true;
      //Obtenemos los puestos de la estación seleccionada utilizando su ID
      this.estacionesService.getPuestos(this.estacion).subscribe((puestos: any) => {
        if (puestos.status == 200) {
          setTimeout(() => {
            for (const puesto of puestos.body) {
              let c = this.conexionesService.conexionesActivas.find((conexion: {
                puesto: any;
              }) => conexion.puesto == puesto.url)
              if (c) {
                puesto.perteneceUsuario = true;
              }
              puestosModificados.push(puesto);
            }
            this.puestos = puestosModificados;
            this.animacionCarga = false;
          }, 200)
        }
      });
    }
  }

  //Función para mostrar las estaciones
  mostrarEstaciones() {
    //Primero comprobamos que la lista de patinetes no está vacía
    if (this.num_patinetes > 0) {
      //Si existe al menos 1 patinete, obtenemos las estaciones para mostrarlas
      this.estacionesService.getEstaciones().subscribe(response => {
        if (response.status == 200) {
          this.estaciones = response.body;
          this.mostrarDatos = true;
        }
      });
      //Se estable a true "mostrarDatos" para controlar que se puedan ver las estaciones
    }
  }

  //Función que abre el modal que simula la interacción del usuario con la aplicación
  open(puesto: any) {
    //Se define el componente que servirá como modal de este componente
    let modalRef = this.modalService.open(ConexionesModalComponent);
    //En el modal interesan valores obtenidos en este componente, por lo que se mandan al modal
    modalRef.componentInstance.puesto = puesto;
    modalRef.componentInstance.patinetesList = this.patinetes;
    modalRef.componentInstance.estacion = this.estacionSeleccionada;

    modalRef.componentInstance.actualizarPuestos.subscribe((valor: boolean) => {
      if (valor) {
        this.getPatinetes()
        this.getConexionesActivas()
        this.mostrarPuestos()
      }
    })
  }

  seleccionarEstacion(conexion: any) {
    this.formulario.patchValue({
      estaciones: [conexion.estacionId],
    })
    this.mostrarPuestos()
  }

}
