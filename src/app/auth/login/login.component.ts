import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      password: ['', Validators.required],
    });
  }

  loginUsuario() {

    if (this.loginForm.invalid) { return; } //comprueba si es valido si no, no hace nada

    //Pongo un alert de espera mientras comprueba los datos en firebase
    Swal.fire({
      title: 'Espere por favor',
      didOpen: () => {
        Swal.showLoading()
      }
    });

    const { email, password } = this.loginForm.value;
    //Aqui uso la autentificacion, y como es una promesa uso el then/catch:
    this.authService.loginUsuario(email, password)
      .then(credenciales => {
        console.log("Credenciales: ", credenciales);
        Swal.close(); //Aqui se cierra la alerta, cuando recibe los datos de la auth
        this.router.navigate(['/']);
      }).catch(error => {
        console.log(error);

        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.message
        })

      });




  }


}
