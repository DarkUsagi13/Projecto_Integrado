import {Component} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import { Router } from '@angular/router';
import {Patinete} from "../patinete";
import {PatinetesService} from "../patinetes.service";
import {PerfilService} from "../perfil.service";

@Component({
  selector: 'app-gestion-patinetes',
  templateUrl: './gestion-patinetes.component.html',
  styleUrls: ['./gestion-patinetes.component.css']
})
export class GestionPatinetesComponent {

  public datosPatinetes: Array<Patinete> = [];
  public idUsuario: string = '';
  public formulario!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private patineteService: PatinetesService,
    private perfilUsuarios: PerfilService,
    private  router: Router,
  ) {
  }

  ngOnInit() {
    this.idUsuario = this.perfilUsuarios.getLoggedInUser();
    this.formulario = this.fb.group({
      marca: new FormControl(''),
      modelo: new FormControl(''),
      consumo: new FormControl(''),
      idUsuario: new FormControl(this.patineteService.setUsuario(this.idUsuario)),
    })
  }

  postPatinete() {
    this.patineteService.postPatinete(this.formulario.value).subscribe(data => {
    });
    this.router.navigate(['']);
  }

}
