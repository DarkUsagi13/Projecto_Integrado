import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {UsuariosService} from "../usuarios.service";

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})
export class TemplateComponent implements OnInit {

  public usuario: any = {};
  public staff: boolean = false;

  constructor(
    private router: Router,
    private usuariosService: UsuariosService,
  ) {}

  ngOnInit() {

    this.usuario = JSON.parse(localStorage.getItem('userData')!)?.username

    this.isStaff()

  }

  logOut(): void {
    localStorage.removeItem("userData");
    this.router.navigateByUrl("/login").then(r => {})
  }

  isStaff() {
    const usuario_id = JSON.parse(localStorage.getItem('userData')!)?.id

    this.usuariosService.perfil(usuario_id).subscribe(usuario => {
      if (usuario.is_staff) {
        this.staff = usuario.is_staff;
      }
    })

  }

}
