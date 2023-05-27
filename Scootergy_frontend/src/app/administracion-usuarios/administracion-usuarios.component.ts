import { Component } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Usuario} from "../usuario";
import {BusquedasService} from "../busquedas.service";

@Component({
  selector: 'app-administracion-usuarios',
  templateUrl: './administracion-usuarios.component.html',
  styleUrls: ['./administracion-usuarios.component.scss']
})
export class AdministracionUsuariosComponent {
  formularioBusquedas!: FormGroup;
  valorBusqueda: string = '';
  filtroBusqueda: any = '';
  ordenBusqueda: any = '';

  usuarios: any = {}

  constructor(
    private busquedaService: BusquedasService,
    private fb: FormBuilder,
  ) {

    this.filtroBusqueda = {
      'username': 'Nombre de usuario',
      'date_joined': 'Fecha de alta',
    }

    this.ordenBusqueda = {
      '' : 'Ascendiente',
      '-' : 'Descendiente',
    }

    this.formularioBusquedas = this.fb.group({
      barraBusqueda: [''],
      filtroBusqueda: [''],
      ordenBusqueda: [' '],
    })
  }

  ngOnInit() {

    this.formularioBusquedas.valueChanges.subscribe(valores => {
        this.valorBusqueda = valores;
        console.log(valores)
        this.buscarUsuarios();
      }
    )
    this.buscarUsuarios();
  }

  buscarUsuarios() {
    const valor = this.formularioBusquedas.get('barraBusqueda')?.value
    const orden = this.formularioBusquedas.get('ordenBusqueda')?.value
    const filtro = this.formularioBusquedas.get('filtroBusqueda')?.value
    this.busquedaService.buscarUsuarios(valor, orden, filtro).subscribe(usuarios => {
      this.usuarios = usuarios;
      console.log(usuarios)
    })
  }
}
