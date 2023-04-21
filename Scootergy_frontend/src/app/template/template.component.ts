import { Component } from '@angular/core';
import {PerfilService} from "../perfil.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})
export class TemplateComponent {

  public usuario: any = {};

  constructor(
    private perfilService: PerfilService,
    private router: Router,
  ) {}

  ngOnInit() {
    const id = this.perfilService.getLoggedInUser();
    this.perfilService.perfil(id).subscribe(usuario => {
      if (usuario.username) {
        this.usuario = usuario;
      } else {
      }
    })
  }

  logOut(): void {
    localStorage.removeItem("userData");
    this.router.navigateByUrl("/login").then(r => {})
  }

}
