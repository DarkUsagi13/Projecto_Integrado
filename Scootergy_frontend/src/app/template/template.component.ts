import { Component } from '@angular/core';
import {PerfilService} from "../perfil.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css']
})
export class TemplateComponent {

  public id: string = "";

  constructor(
    private perfilService: PerfilService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.id = this.perfilService.getLoggedInUser()
  }

  logOut(): void {
    localStorage.removeItem("userData");
    this.router.navigateByUrl("/login")
  }

}
