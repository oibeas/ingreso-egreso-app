import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import * as ui from 'src/app/shared/ui.actions';

import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
  cargando: boolean = false;
  uiSubscription: Subscription;  //Esta variable nos servira para desubscribirnos cuando abandonemos la pagina

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private store: Store<AppState>,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      password: ['', Validators.required],
    });

    //Aqui nos subscribimos al ui para ver el cambio de estado a isLoading
    this.uiSubscription = this.store.select('ui')
      .subscribe(ui => {
        this.cargando = ui.isLoading;
        console.log('cargando subs');

      });

  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe(); //Esto es para desubscribirnos cuando abandonemos la pagina
  }



  loginUsuario() {

    if (this.loginForm.invalid) { return; } //comprueba si es valido si no, no hace nada

    this.store.dispatch(ui.isLoading());



    //Pongo un alert de espera mientras comprueba los datos en firebase
    // Swal.fire({
    //   title: 'Espere por favor',
    //   didOpen: () => {
    //     Swal.showLoading()
    //   }
    // });

    const { email, password } = this.loginForm.value;
    //Aqui uso la autentificacion, y como es una promesa uso el then/catch:
    this.authService.loginUsuario(email, password)
      .then(credenciales => {
        console.log("Credenciales: ", credenciales);
        // Swal.close(); //Aqui se cierra la alerta, cuando recibe los datos de la auth
        this.store.dispatch(ui.stopLoading()); //Para pararlo antes de navegar
        this.router.navigate(['/']);
      }).catch(error => {
        console.log(error);
        this.store.dispatch(ui.stopLoading());//Para pararlo si da error

        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.message
        })

      });




  }


}
