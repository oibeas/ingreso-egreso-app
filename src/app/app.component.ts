import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private authService: AuthService) {
    this.authService.initAuthListener(); //Este metodo nos recupera todos los datos del usuario en firebase, esta creado en authservice
  }

}
