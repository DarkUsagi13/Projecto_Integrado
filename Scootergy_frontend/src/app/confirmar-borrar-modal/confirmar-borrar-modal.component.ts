import {Component, Input, OnInit, EventEmitter, Output} from '@angular/core';
import {PatinetesService} from "../patinetes.service";

@Component({
  selector: 'app-confirmar-borrar-modal',
  templateUrl: './confirmar-borrar-modal.component.html',
  styleUrls: ['./confirmar-borrar-modal.component.scss']
})
export class ConfirmarBorrarModalComponent implements OnInit{

  @Input() patinete?: any;
  @Output() actualizar: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private patinetesService: PatinetesService,
  ) {
  }

  ngOnInit() {
  }

  eliminarPatinete() {
    this.patinetesService.eliminarPatinete(this.patinete?.id).subscribe(response => {
      if (response.status == 204) {
        this.actualizar.emit(true)
      }
    });
  }

}
