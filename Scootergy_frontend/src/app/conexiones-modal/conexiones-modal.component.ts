import {Component, Input} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ConexionesService} from "../conexiones.service";
import {Conexion} from "../conexion";
import {EstacionesService} from "../estaciones.service";
import {PerfilService} from "../perfil.service";
import {PatinetesService} from "../patinetes.service";
import {PaypalService} from "../paypal.service";

@Component({
  selector: 'app-conexiones-modal',
  templateUrl: './conexiones-modal.component.html',
  styleUrls: ['./conexiones-modal.component.scss']
})
export class ConexionesModalComponent {

  conexion: any = {};
  perfil: any;
  formulario!: FormGroup;
  @Input() puesto: any;
  patinete: any;
  @Input() patinetesList: any;
  @Input() estacion: any;
  public showPaypalButtons: boolean | undefined;
  approvalUrl: any;
  conexionUsuario: boolean = false;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private conexionService: ConexionesService,
    private estacionService: EstacionesService,
    private perfilService: PerfilService,
    private patineteService: PatinetesService,
    private paypalService: PaypalService,
  ) {

  }

  ngOnInit() {
    this.formulario = this.fb.group({
      patinetesList: new FormControl('', Validators.required)
    })
    this.perfilService.perfil(this.perfilService.getLoggedInUser()).subscribe(perfil => {
      this.perfil = perfil;
      this.conexionService.getConexionActual(this.perfil.id, this.puesto);
      this.conexion = this.conexionService.conexionActual;
      console.log(this.conexion)
      this.conexionUsuario = this.perfil.url == this.conexion.usuario;
    })
  }

  crearPago() {
    this.paypalService.crearPago(this.conexion).subscribe(
      (response: any) => {
        this.approvalUrl = response.approval_url;
        window.location.href = this.approvalUrl;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  back() {
    this.showPaypalButtons = false;
  }

  setConexion() {
    // IMPORTANTE!!! CREAR UNA PÁGINA DE RESUMEN QUE MANDE AL  USUARIO A LA MISMA AL INICIAR CORRECTAMENTE UNA CONEXIÓN
    const idUsuario = this.perfilService.getLoggedInUser();
    this.patinete = this.formulario.get('patinetesList')!.value;
    this.conexion = new Conexion(
      `http://127.0.0.1:8000/puesto/${this.puesto.id}/`,
      `http://127.0.0.1:8000/patinete/${this.patinete}/`,
      `http://127.0.0.1:8000/usuario/${idUsuario}/`,
      null,
      0,
      0,
      false,
    );
    this.conexionService.postConexion(this.conexion).subscribe((response: any) => {
      this.puesto.disponible = false;
      this.estacionService.updatePuesto(this.puesto.id, this.puesto).subscribe();
      this.patineteService.setPatineteSeleccionado(this.patinete);
      this.conexionService.getConexiones(this.perfil.id).subscribe(conexiones => {
        this.conexionService.conexiones = conexiones;
      });
    });
    this.activeModal.close()
  }

  ngOnDestroy() {
    localStorage.removeItem('conexion')
  }

}
