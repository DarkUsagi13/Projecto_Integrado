import { Component } from '@angular/core';
import { PerfilService } from '../perfil.service';
import {perfilUsuario} from "../perfil";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-datos-perfil',
  templateUrl: './datos-perfil.component.html',
  styleUrls: ['./datos-perfil.component.scss']
})
export class DatosPerfilComponent {

  idUsuario: string = "";
  datosPerfil!: any;
  formulario!: FormGroup;

  constructor(
    private perfilService: PerfilService,
    private fb: FormBuilder,
  ) {

    this.formulario = this.fb.group({
      username: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    })

  }

  ngOnInit() {
    this.idUsuario =this.perfilService.getLoggedInUser();

    this.perfilService.perfil(this.idUsuario).subscribe((perfilUsuario: perfilUsuario[]) => {
      this.datosPerfil = perfilUsuario;
      this.editarPerfil()
    });


  }

  editarPerfil() {
    this.formulario.patchValue({
      username: this.datosPerfil.username,
      email: this.datosPerfil.email,
    })
  }

  putPerfil() {
    this.perfilService.putPerfil(this.idUsuario, this.formulario.value).subscribe(data => {})
  }

}

