import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup} from '@angular/forms';
import {PerfilService} from "../perfil.service";

@Component({
  selector: 'app-administracion-detalles-usuario',
  templateUrl: './administracion-detalles-usuario.component.html',
  styleUrls: ['./administracion-detalles-usuario.component.scss']
})
export class AdministracionDetallesUsuarioComponent implements OnInit {

  @Input() usuario: any = {};
  @Output() usuarioActualizado: EventEmitter<boolean> = new EventEmitter<boolean>();
  actualizarUsuario!: FormGroup;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private perfilService: PerfilService,
  ) {
  }

  ngOnInit() {
    this.actualizarUsuario = this.fb.group({
      is_staff: this.usuario.is_staff,
    });
  }

  cambiarStaff() {
    if (this.actualizarUsuario.invalid) {

    } else {
      this.perfilService.patchPerfil(this.usuario.id, this.actualizarUsuario.value).subscribe((response) => {
        if (response.status == 200) {
          this.usuarioActualizado.emit(true);
          this.activeModal.close()
        }
      })
    }
  }
}
