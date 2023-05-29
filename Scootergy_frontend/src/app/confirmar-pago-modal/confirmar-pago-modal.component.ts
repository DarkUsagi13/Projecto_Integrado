import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-confirmar-pago-modal',
  templateUrl: './confirmar-pago-modal.component.html',
  styleUrls: ['./confirmar-pago-modal.component.scss']
})
export class ConfirmarPagoModalComponent implements OnInit {

  @Output() confirmarPago: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private activeModal: NgbActiveModal,
  ) {
  }

  ngOnInit() {

  }

  enviarValor() {
    this.confirmarPago.emit(true);
    this.activeModal.close()
  };

  close() {
    this.activeModal.close()
  }

}
