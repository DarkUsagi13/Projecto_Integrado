import {Component, Input, OnInit, EventEmitter, Output} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {PatinetesService} from "../patinetes.service";
import {UsuariosService} from "../usuarios.service";

@Component({
  selector: 'app-confirmar-borrar-modal',
  templateUrl: './confirmar-borrar-modal.component.html',
  styleUrls: ['./confirmar-borrar-modal.component.scss']
})
export class ConfirmarBorrarModalComponent implements OnInit{

  @Input() patinete: any;
  @Output() response: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    public activeModal: NgbActiveModal,
    private patinetesService: PatinetesService,
    private perfilService: UsuariosService,
  ) {
  }

  ngOnInit() {
  }

  eliminarPatinete() {
    const usuario_id = this.perfilService.obtenerIdUsuario();
    this.patinetesService.eliminarPatinete(usuario_id, this.patinete.id).subscribe();
  }

}
