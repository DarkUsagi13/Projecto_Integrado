import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ConexionesService} from "../conexiones.service";
import {Conexion} from "../conexion";
import {EstacionesService} from "../estaciones.service";
import {PerfilService} from "../perfil.service";
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
  patinete: any;
  @Input() patinetesList: any;
  @Input() estacion: any;
  approvalUrl: any;
  confirmarPago: boolean = false;
  cargarDatos: boolean = false;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private conexionesService: ConexionesService,
    private estacionService: EstacionesService,
    private perfilService: PerfilService,
    private patineteService: PatinetesService,
    private paypalService: PaypalService,
    private modalService: NgbModal,
  ) {

  }

  ngOnInit() {
    this.formulario = this.fb.group({
      patinetesList: new FormControl('', Validators.required)
    })

    this.id_usuario = this.perfilService.obtenerIdUsuario()

    if (!this.puesto.disponible) {
      this.conexionesService.getConexionActual(this.id_usuario, this.puesto.id).subscribe(conexion => {
        console.log(conexion)
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
    this.patinete = this.formulario.get('patinetesList')!.value;
    this.crearConexion = new Conexion(
      `http://127.0.0.1:8000/puesto/${this.puesto.id}/`,
      `http://127.0.0.1:8000/patinete/${this.patinete}/`,
      `http://127.0.0.1:8000/usuario/${this.id_usuario}/`,
      null,
      0,
      0,
      false,
    );
    this.conexionesService.postConexion(this.crearConexion).subscribe((response: any) => {
      this.puesto.disponible = false;
      this.estacionService.updatePuesto(this.puesto.id, this.puesto).subscribe();
      this.patineteService.setPatineteSeleccionado(this.patinete);
      this.conexionesService.getConexionesActivas(this.id_usuario.id).subscribe(conexiones => {
        this.conexionesService.conexionesActivas = conexiones;
      });

      if (response.status == 201) {
      }
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
