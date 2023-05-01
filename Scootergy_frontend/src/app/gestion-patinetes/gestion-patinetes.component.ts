import {Component} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import { Router } from '@angular/router';
import {Patinete} from "../patinete";
import {PatinetesService} from "../patinetes.service";
import {PerfilService} from "../perfil.service";

@Component({
  selector: 'app-gestion-patinetes',
  templateUrl: './gestion-patinetes.component.html',
  styleUrls: ['./gestion-patinetes.component.scss']
})
export class GestionPatinetesComponent {

  public datosPatinetes: Array<Patinete> = [];
  public idUsuario: string = '';
  public perfil: any;
  public formulario!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private patineteService: PatinetesService,
    private perfilService: PerfilService,
    private  router: Router,
  ) {
    this.formulario = this.fb.group({
      marca: new FormControl(''),
      modelo: new FormControl(''),
      consumo: new FormControl(''),
      idUsuario: new FormControl(''),
    })
  }

  ngOnInit() {
    this.idUsuario = this.perfilService.getLoggedInUser();
    this.perfilService.perfil(this.idUsuario).subscribe(perfil =>{
      this.perfil = perfil
      this.formulario.patchValue({
        idUsuario: this.perfil.url,
      })
    })

  }

  postPatinete() {
    this.patineteService.postPatinete(this.formulario.value).subscribe(data => {
    });
    this.patineteService.patinetes(this.idUsuario).subscribe()
    this.router.navigate(['']);
  }

}
