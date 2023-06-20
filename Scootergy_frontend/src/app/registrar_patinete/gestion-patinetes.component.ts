import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from '@angular/router';
import {PatinetesService} from "../patinetes.service";
import {UsuariosService} from "../usuario.service";
import {Patinete} from "../patinete";

@Component({
  selector: 'app-gestion-patinetes',
  templateUrl: './gestion-patinetes.component.html',
  styleUrls: ['./gestion-patinetes.component.scss']
})
export class GestionPatinetesComponent implements OnInit {

  public idUsuario: string = '';
  public perfil: any;
  public formulario!: FormGroup;
  public marcas: any[] = [];
  public modelos: any[] = [];

  constructor(
    private fb: FormBuilder,
    private patineteService: PatinetesService,
    private usuariosService: UsuariosService,
    private router: Router,
  ) {
    this.formulario = this.fb.group({
      marca: new FormControl('', Validators.required),
      modelo: new FormControl('', Validators.required),
      consumo: new FormControl({value: '', disabled: true}),
      usuario: new FormControl(''),
    })
    this.idUsuario = this.usuariosService.obtenerIdUsuario();
    this.usuariosService.perfil(this.idUsuario).subscribe(perfil => {
      this.perfil = perfil
      this.formulario.patchValue({
        usuario: this.perfil.url,
      })
    })
  }

  ngOnInit() {
    this.getMarcasPatinetes()
  }

  getMarcasPatinetes() {
    this.patineteService.getMarcas().subscribe(response => {
      this.marcas = response.body;
    })
  }

  getModelosPatinetes() {

    const modelo_id = this.formulario.get('marca')?.value.id

    if (modelo_id) {
      this.patineteService.getModelos(modelo_id).subscribe(response => {
        this.modelos = response.body
        this.formulario.get('modelo')?.valueChanges.subscribe(modelo => {
          this.formulario.patchValue({
            consumo: modelo.consumo
          })
        })
      })
    }

  }

  registrarPatinete() {
    if (this.formulario.invalid) {
      console.log("prueba")
      console.log(this.formulario.invalid)
    } else {
      const modelo = this.formulario.get('modelo')?.value
      const patinete = new Patinete(modelo.url, this.perfil.url)

      this.patineteService.registrarPatinete(patinete).subscribe(response => {
        if (response.status == 201) {
          this.router.navigate(['']);
        }
      });
    }
  }

}
