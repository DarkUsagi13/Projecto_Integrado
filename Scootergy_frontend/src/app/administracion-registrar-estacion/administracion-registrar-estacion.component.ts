import {Component, EventEmitter, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ProvinciasService} from "../provincias.service";
import {EstacionesService} from "../estaciones.service";

@Component({
  selector: 'app-administracion-registrar-estacion',
  templateUrl: './administracion-registrar-estacion.component.html',
  styleUrls: ['./administracion-registrar-estacion.component.scss']
})
export class AdministracionRegistrarEstacionComponent {

  @Output() actualizar: EventEmitter<any> = new EventEmitter<any>();

  public formulario!: FormGroup;

  provincias: any[] = [];
  comunidades: any[] = [];
  andalucia: any[] = [];
  sevilla: any[] = [];

  constructor(
    private fb: FormBuilder,
    private provinciasService: ProvinciasService,
    private estacionesService: EstacionesService,
  ) {
    this.formulario = this.fb.group({
      nombre: new FormControl('', Validators.required),
      direccion: new FormControl('', Validators.required),
      comunidad: new FormControl('', Validators.required),
      provincia: new FormControl('', Validators.required),
      num_puestos: new FormControl('', [Validators.required, Validators.pattern(/^[1-9][0-9]*$/)]),
    })
  }

  ngOnInit() {
    this.getComunidades()
  }

  getComunidades() {
    this.provinciasService.getComunidades().subscribe(response => {
      if (response.status == 200) {
        this.comunidades = response.body;
        for (const c of this.comunidades) {
          if (c.id == 1) {
            this.andalucia.push(c)
          }
        }
      }
    })
  }

  getProvincias() {
    const comunidad_id = this.formulario.get('comunidad')?.value.id
    this.provinciasService.getProvincias(comunidad_id).subscribe(response => {
      if (response.status == 200) {
        this.provincias = response.body
        for (const p of this.provincias) {
          if (p.id == 8) {
            this.sevilla.push(p)
          }
        }
      }
    })
  }

  registrarEstacion() {
    if (this.formulario.invalid) {
      console.log(this.formulario.errors)
    } else {
      this.formulario.removeControl('comunidad')
      const num_puestos = this.formulario.get('num_puestos')?.value
      this.formulario.removeControl('num_puestos')
      const provincia = this.formulario.get('provincia')?.value
      this.formulario.patchValue({
        provincia: provincia.url,
      })
      this.estacionesService.postEstacion(this.formulario.value, num_puestos).subscribe(response => {
        this.actualizar.emit(true);
      });
    }
  }

}
