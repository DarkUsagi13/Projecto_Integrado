import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Scootergy';

  public onActivate(event: any) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

}
