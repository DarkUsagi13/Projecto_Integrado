import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ProvinciasService} from "../provincias.service";
import {EstacionesService} from "../estaciones.service";

@Component({
  selector: 'app-detalles-estacion',
  templateUrl: './detalles-estacion.component.html',
  styleUrls: ['./detalles-estacion.component.scss']
})
export class DetallesEstacionComponent {

  @Output() actualizar: EventEmitter<any> = new EventEmitter<any>();
  @Input() estacion: any;

  provincias: any[] = [];
  comunidades: any[] = [];

  public formulario!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private provinciasService: ProvinciasService,
    private estacionesService: EstacionesService,
  ) {

    this.formulario = this.fb.group({
      nombre: new FormControl('', Validators.required),
      direccion: new FormControl('', Validators.required),
      comunidad: new FormControl(''),
      provincia: new FormControl(),
    })

  }

  ngOnInit() {
    this.getComunidades()
    this.formulario.patchValue({
      nombre: this.estacion?.nombre,
      direccion: this.estacion?.direccion,
      comunidad: this.estacion?.comunidad
    })

  }

  getComunidades() {
    this.provinciasService.getComunidades().subscribe(response => {
      if (response.status == 200) {
        this.comunidades = response.body;
      }
    })
  }

  getProvincias() {

    const comunidad_id = this.formulario.get('comunidad')?.value.id

    this.provinciasService.getProvincias(comunidad_id).subscribe(response => {
      if (response.status == 200) {
        this.provincias = response.body
      }
    })
  }

  editarEstacion() {
    if (this.formulario.invalid) {
      console.log(this.formulario.errors);
    } else {
      this.formulario.removeControl('comunidad')
      const provincia = this.formulario.get('provincia')?.value
      this.formulario.patchValue({
        provincia: provincia.url
      })
      this.estacionesService.editarEstacion(this.estacion.id, this.formulario.value).subscribe(response => {
        if (response.status == 200) {
          this.actualizar.emit(true);
        }
      })
    }
  }

}
