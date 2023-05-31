import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {Estacion} from '../estacion';
import {EstacionesService} from '../estaciones.service';
import {Patinete} from '../patinete';
import {UsuariosService} from '../usuarios.service';
import {Puesto} from '../puesto';
import {PatinetesService} from "../patinetes.service";
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ConexionesModalComponent} from "../conexiones-modal/conexiones-modal.component";
import {ConexionesService} from "../conexiones.service";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  // Variables necesarias para el componente
  patinetes: Patinete[] = [];
  estaciones: Estacion[] = [];
  puestos: Puesto[] = [];
  estacion!: any;
  estacionSeleccionada!: any;
  formulario!: FormGroup;
  mostrarDatos = false;
  mostrarAnimacion: boolean = false;
  usuario: any;

  animacionCarga: boolean = true;

  constructor(
    private usuariosService: UsuariosService,
    private patinetesService: PatinetesService,
    private estacionesService: EstacionesService,
    private conexionesService: ConexionesService,
    private router: Router,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private sanitizer: DomSanitizer,
  ) {
  }

  ngOnInit(): void {
    //Se obtiene el ID del usuario autenticado
    this.usuario = this.usuariosService.obtenerIdUsuario();
    //Se obtienen los patinetes del usuario autenticado y llama a la función mostrarEstaciones()
    this.patinetesService.patinetes(this.usuario).subscribe((data: Patinete[]) => {
      this.patinetes = data;
      this.mostrarEstaciones()
    });
    //Formulario para mostrar las estaciones
    this.formulario = this.fb.group({
      estaciones: ['Seleccione...', Validators.required],
    });
    //Se obtienen las conexiones activas del usuario autenticado
    this.conexionesService.getConexionesActivas(this.usuario).subscribe(conexiones => {
      this.conexionesService.conexionesActivas = conexiones.body; // Almacenar los resultados en un array
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
          }, 1000)
        }

      });
    }
  }

  //Función para mostrar las estaciones
  mostrarEstaciones() {
    //Primero comprobamos que la lista de patinetes no está vacía
    if (this.patinetes.length > 0) {
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
        this.mostrarPuestos()
      }
    })

  }

  getGoogleMapsUrl(): SafeResourceUrl {
    const locations: Record<number, string> = {
      1: "https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d198.08063924507545!2d-5.982727812142744!3d37.40661445991176!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses!2ses!4v1685547837616!5m2!1ses!2ses\n",
      2: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d333.24600804025494!2d-5.986872678085705!3d37.38065099442517!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd126c21d2c5cd5f%3A0xfeb210fa19076ce9!2sAvenida%20Carlos%20V%20(Prado%20San%20Sebasti%C3%A1n)!5e0!3m2!1ses!2ses!4v1685548487032!5m2!1ses!2ses\n",
      3: "https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d560.3716565047963!2d-5.976950177904099!3d37.391232594358144!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1ssanta%20justa!5e0!3m2!1ses!2ses!4v1685549758910!5m2!1ses!2ses",
      4: "https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1332.990374527554!2d-5.987627540962078!3d37.38029417828129!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses!2ses!4v1685549841432!5m2!1ses!2ses",
      5: "https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d471.2146114402268!2d-6.009990954438365!3d37.39121759645285!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses!2ses!4v1685549964023!5m2!1ses!2ses",
      6: "https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d283.3725535567285!2d-6.2925033805578225!3d36.53012785056957!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses!2ses!4v1685550022676!5m2!1ses!2ses",
      7: "https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d400.8804286669742!2d-6.276170380801726!3d36.50481373975582!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses!2ses!4v1685550134526!5m2!1ses!2ses",
      8: "https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d234.06957601416684!2d-4.779367133699339!3d37.87778249034196!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses!2ses!4v1685550241685!5m2!1ses!2ses",
      9: "https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d468.151099969779!2d-4.782050570240055!3d37.875902521692204!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1salcazar%20de%20los%20reyes%20cristalinos!5e0!3m2!1ses!2ses!4v1685550605173!5m2!1ses!2ses"
    };

    const selectedStation = this.estacionSeleccionada?.id;

    if (selectedStation && locations[selectedStation]) {
      const url = locations[selectedStation];
      return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    } else {
      return '';
    }
  }


}
