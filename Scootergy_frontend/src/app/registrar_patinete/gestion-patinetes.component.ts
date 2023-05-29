import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from '@angular/router';
import {PatinetesService} from "../patinetes.service";
import {UsuariosService} from "../usuarios.service";

@Component({
  selector: 'app-gestion-patinetes',
  templateUrl: './gestion-patinetes.component.html',
  styleUrls: ['./gestion-patinetes.component.scss']
})
export class GestionPatinetesComponent implements OnInit {

  public idUsuario: string = '';
  public perfil: any;
  public formulario!: FormGroup;

  public patternMarcaModelo = /^[A-Za-z0-9.\s\-]+$/;

  public marcaModeloInvalid = 'El campo puede contener solo letras, números, guiones y puntos.';

  public consumoInvalid = 'El consumo no puede ser menor a 1'

  constructor(
    private fb: FormBuilder,
    private patineteService: PatinetesService,
    private usuariosService: UsuariosService,
    private router: Router,
  ) {
    this.formulario = this.fb.group({
      marca: new FormControl('', [Validators.required, Validators.pattern(this.patternMarcaModelo)]),
      modelo: new FormControl('', [Validators.required, Validators.pattern(this.patternMarcaModelo)]),
      consumo: new FormControl('', [Validators.required, Validators.min(1)]),
      usuario: new FormControl('', [Validators.required]),
    })
  }

  ngOnInit() {
    this.idUsuario = this.usuariosService.obtenerIdUsuario();
    this.usuariosService.perfil(this.idUsuario).subscribe(perfil => {
      this.perfil = perfil
      this.formulario.patchValue({
        usuario: this.perfil.url,
      })
    })

  }

  registrarPatinete() {
    if (this.formulario.invalid) {
      console.log(this.formulario.invalid)
    } else {
      this.patineteService.registrarPatinete(this.formulario.value).subscribe(data => {});
      // this.patineteService.patinetes(this.idUsuario).subscribe()
      this.router.navigate(['']);
    }
  }

}
