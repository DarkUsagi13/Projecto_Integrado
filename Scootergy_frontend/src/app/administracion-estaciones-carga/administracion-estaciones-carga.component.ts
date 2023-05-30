import {Component, OnInit} from '@angular/core';
import {EstacionesService} from "../estaciones.service";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {BusquedasService} from "../busquedas.service";

@Component({
  selector: 'app-administracion-estaciones-carga',
  templateUrl: './administracion-estaciones-carga.component.html',
  styleUrls: ['./administracion-estaciones-carga.component.scss']
})
export class AdministracionEstacionesCargaComponent implements OnInit {

  formularioBusquedas!: FormGroup;
  filtroBusqueda: any = '';
  ordenBusqueda: any = '';

  listadoEstaciones: any = {};
  mostrarAnimacion: boolean = true;

  constructor(
    private fb: FormBuilder,
    private busquedasService: BusquedasService,
  ) {

    this.filtroBusqueda = {
      nombre: 'Nombre',
      direccion: 'Dirección',
      provincia__nombre: 'Provincia',
    };

    this.ordenBusqueda = {
      '': 'Ascendente',
      '-': 'Descendente'
    };

    this.formularioBusquedas = this.fb.group({
      barraBusqueda: new FormControl(''),
      filtroBusqueda: new FormControl('nombre'), // Establece la opción predeterminada como 'Nombre'
      ordenBusqueda: new FormControl('')
    });

  }

  ngOnInit() {

    this.buscarEstaciones();

    this.formularioBusquedas.valueChanges.subscribe(valores => {
      this.buscarEstaciones();
    })

  }

  buscarEstaciones() {

    const valor = this.formularioBusquedas.get('barraBusqueda')?.value;
    const orden = this.formularioBusquedas.get('ordenBusqueda')?.value;
    const filtro = this.formularioBusquedas.get('filtroBusqueda')?.value;

    this.busquedasService.buscarEstaciones(orden, filtro, valor).subscribe(response => {
      if (response.status == 200) {
        setTimeout(() => {
          this.listadoEstaciones = response.body;
          this.mostrarAnimacion = false;
        }, 500)
      }
    })
  }

}
