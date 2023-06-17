import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {EstacionesService} from "../estaciones.service";

@Component({
  selector: 'app-agregar-puestos-estacion',
  templateUrl: './agregar-puestos-estacion.component.html',
  styleUrls: ['./agregar-puestos-estacion.component.scss']
})
export class AgregarPuestosEstacionComponent {

  @Output() actualizar: EventEmitter<any> = new EventEmitter<any>();

  @Input() estacion!: any;

  formulario!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private estacionesService: EstacionesService,
  ) {

    this.formulario = this.fb.group({
      num_puestos: new FormControl('', [Validators.required, Validators.pattern(/^[1-9][0-9]*$/)]),
    })

  }

  ngOnInit() {

  }

  addPuestos() {
    if (this.formulario.invalid) {
      console.log(this.formulario.invalid )
    } else {
      const estacion_id = this.estacion.id
      const num_puestos = this.formulario.get('num_puestos')?.value
      this.estacionesService.postPuestos(estacion_id, num_puestos).subscribe(response => {
        if (response.status == 201) {
          this.actualizar.emit(true);
        }
      })
    }
  }

}
