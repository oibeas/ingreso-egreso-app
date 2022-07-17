import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit {

  registroForm: FormGroup = new FormGroup({});

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit(): void {

    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      password: ['', Validators.required],
    });

  }

  crearUsuario() {

    if (this.registroForm.invalid) { return; } //comprueba si es valido si no, no hace nada

    //Pongo un alert de espera mientras comprueba los datos en firebase
    Swal.fire({
      title: 'Espere por favor',
      didOpen: () => {
        Swal.showLoading()
      }
    });

    const { nombre, correo, password } = this.registroForm.value;
    //Aqui uso la autentificacion, y como es una promesa uso el then/catch:
    this.authService.crearUsuario(nombre, correo, password)
      .then(credenciales => {
        console.log(credenciales);

        Swal.close();

        this.router.navigate(['/']);
      }).catch(error => {
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.message
        })
      });

  }

}
