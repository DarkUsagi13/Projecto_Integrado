import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ConexionesService} from "../conexiones.service";
import {Conexion} from "../conexion";
import {EstacionesService} from "../estaciones.service";
import {UsuariosService} from "../usuario.service";
import {PatinetesService} from "../patinetes.service";
import {PaypalService} from "../paypal.service";
import {ConfirmarPagoModalComponent} from "../confirmar-pago-modal/confirmar-pago-modal.component";

@Component({
  selector: 'app-conexiones-modal',
  templateUrl: './conexiones-modal.component.html',
  styleUrls: ['./conexiones-modal.component.scss']
})
export class ConexionesModalComponent implements OnInit, OnDestroy {

  crearConexion: any = {};
  conexion: any = {};
  perfil: any;
  id_usuario: any;
  formulario!: FormGroup;
  @Input() puesto: any;
  patinete_id: any;
  @Input() patinetesList: any[] = [];
  patinetesDisponibles: any[] = [];
  @Input() estacion: any;
  approvalUrl: any;
  confirmarPago: boolean = false;
  cargarDatos: boolean = false;
  activarSelect: boolean = false;

  @Output() actualizarPuestos: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private conexionesService: ConexionesService,
    private estacionService: EstacionesService,
    private perfilService: UsuariosService,
    private patineteService: PatinetesService,
    private paypalService: PaypalService,
    private modalService: NgbModal,
  ) {}

  ngOnInit() {
    for (const patinete of this.patinetesList) {
      if (patinete.disponible) {
        this.patinetesDisponibles.push(patinete)
      }
    }

    let comprobar = false;
    if (this.patinetesDisponibles.length == 0) {
      comprobar = true;
    }
    this.activarSelect = comprobar;
    this.formulario = this.fb.group({
      patinetesList: new FormControl({value: '', disabled: this.activarSelect}, Validators.required)
    })
    this.id_usuario = this.perfilService.obtenerIdUsuario()
    if (!this.puesto?.disponible) {
      this.conexionesService.getConexionActual(this.id_usuario, this.puesto?.id).subscribe(conexion => {
        if (conexion.status == 200) {
          let conexionId = conexion.body.id;
          localStorage.setItem('conexion', conexionId)
          this.conexionesService.calcularImporteConexion(this.id_usuario, conexionId).subscribe(conexionCalculo => {
            if (conexionCalculo.status == 200) {
              this.conexion = conexionCalculo.body;
              setTimeout(() => {
                this.cargarDatos = true;
              }, 500)
            }
          });
        }
      });
    }
  }

  crearPago() {
    this.paypalService.crearPago(this.conexion).subscribe(datos => {
        this.approvalUrl = datos.approval_url;
        // window.location.href = this.approvalUrl;
      }
    );
  }

  setConexion() {
    this.patinete_id = this.formulario.get('patinetesList')!.value;
    this.crearConexion = new Conexion(
      `http://127.0.0.1:8000/puesto/${this.puesto.id}/`,
      `http://127.0.0.1:8000/patinete/${this.patinete_id}/`,
      `http://127.0.0.1:8000/usuario/${this.id_usuario}/`,
      null,
      0,
      0,
      false,
    );
    this.conexionesService.postConexion(this.crearConexion, this.puesto.id, this.patinete_id).subscribe((post: any) => {
      if (post.status != 201) {
        return;
      }

      this.patineteService.setPatineteSeleccionado(this.patinete_id);
      this.conexionesService.getConexionesActivas(this.id_usuario).subscribe(conexiones => {

        if (conexiones.status == 200) {

          this.conexionesService.conexionesActivas = conexiones.body;
          this.actualizarPuestos.emit(true)
        }
      });
    });

    this.activeModal.close()
  }

  open() {
    const modalRef = this.modalService.open(ConfirmarPagoModalComponent, {centered: true});
    modalRef.componentInstance.confirmarPago.subscribe((valor: boolean) => {
      if (valor) {
        this.confirmarPago = true;
        this.crearPago()
      }
    });
  }

  ngOnDestroy() {
    localStorage.removeItem('conexion')
  }

}
