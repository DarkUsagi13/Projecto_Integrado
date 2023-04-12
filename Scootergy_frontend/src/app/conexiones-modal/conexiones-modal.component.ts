import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ConexionesService} from "../conexiones.service";
import {Conexion} from "../conexion";
import {EstacionesService} from "../estaciones.service";
import {PerfilService} from "../perfil.service";
import {PatinetesService} from "../patinetes.service";

@Component({
  selector: 'app-conexiones-modal',
  templateUrl: './conexiones-modal.component.html',
  styleUrls: ['./conexiones-modal.component.css']
})
export class ConexionesModalComponent {

  conexion: any;
  formulario!: FormGroup;
  @Input() puesto: any;
  patinete: any;
  @Input() patinetesList: any;
  @Input() estacion: any;
  horaConexion: any;
  horaDesconexion: any;


  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private conexionService: ConexionesService,
    private estacionService: EstacionesService,
    private perfilService: PerfilService,
    private patineteService: PatinetesService,
  ) {

  }

  ngOnInit() {
    this.formulario = this.fb.group({
      patinetesList: new FormControl('', Validators.required)
    })
  }

  setConexion() {
    const idUsuario = this.perfilService.getLoggedInUser();
    this.patinete = this.formulario.get('patinetesList')!.value;
    this.horaConexion = new Date()
    this.conexion = new Conexion(
      `http://127.0.0.1:8000/puesto/${this.puesto.id}/`,
      `http://127.0.0.1:8000/patinete/${this.patinete}/`,
      `http://127.0.0.1:8000/usuario/${idUsuario}/`,
      null,
      121
    )
    // this.conexionService.postConexion(this.conexion).subscribe();
    this.puesto.disponible = false;
    // this.estacionService.putPuesto(this.puesto.id, this.puesto).subscribe();
    this.patineteService.setPatineteSeleccionado(this.patinete)
  }

  // desconectar() {
  //   this.puesto.disponible = true;
  //   this.estacionService.putPuesto(this.puesto.id, this.puesto)
  // }

}
