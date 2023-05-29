import {Component} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {UsuariosService} from "../usuarios.service";
import {PatinetesService} from "../patinetes.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Patinete} from "../patinete";

@Component({
  selector: 'app-detalles-patinete',
  templateUrl: './detalles-patinete.component.html',
  styleUrls: ['./detalles-patinete.component.scss']
})
export class DetallesPatineteComponent {

  formulario!: FormGroup;
  usuario_id = this.perfilService.obtenerIdUsuario();
  perfil: any = {};
  patinete_id = this.activateRoute.snapshot.paramMap.get('id');
  patinete!: Patinete;

  constructor(
    private fb: FormBuilder,
    private perfilService: UsuariosService,
    private patinetesService: PatinetesService,
    private router: Router,
    private activateRoute: ActivatedRoute,) {

    this.formulario = this.fb.group({
      id: new FormControl('', Validators.required),
      marca: new FormControl('', Validators.required),
      modelo: new FormControl('', Validators.required),
      consumo: new FormControl('', Validators.required),
      usuario: new FormControl('', Validators.required),
    })

  }

  ngOnInit() {

    this.usuario_id = this.perfilService.obtenerIdUsuario()

    this.perfilService.perfil(this.usuario_id).subscribe(perfil => {
      this.perfil = perfil;

      this.patinetesService.patinete(this.patinete_id!).subscribe(patinete => {
        this.patinete = patinete[0];
        this.editarPatinete()
      })
    });


  }

  editarPatinete() {
    this.formulario.patchValue({
      id: this.patinete_id,
      marca: this.patinete.marca,
      modelo: this.patinete.modelo,
      consumo: this.patinete.consumo,
      usuario: this.perfil.url
    })
    console.log(this.formulario.value)
  }

  putPatinete() {
    this.patinetesService.puttPatinete(this.patinete.id, this.formulario.value).subscribe(response => {
      this.router.navigateByUrl('/perfil/listado_patinetes')
    })

  }

}
