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
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit, OnDestroy {

  registroForm: FormGroup = new FormGroup({});
  cargando: boolean = false;
  uiSubscription: Subscription;  //Esta variable nos servira para desubscribirnos cuando abandonemos la pagina

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private store: Store<AppState>,
    private router: Router) { }

  ngOnInit(): void {

    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      password: ['', Validators.required],
    });

    //Aqui nos subscribimos al ui para ver el cambio de estado a isLoading
    this.uiSubscription = this.store.select('ui').subscribe(ui => {
      this.cargando = ui.isLoading;
      console.log('cargando subs');
    })

  }


  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe(); //Esto es para desubscribirnos cuando abandonemos la pagina
  }


  crearUsuario() {

    if (this.registroForm.invalid) { return; } //comprueba si es valido si no, no hace nada

    this.store.dispatch(ui.isLoading()); //Aqui disparo cargar la accion

    //Pongo un alert de espera mientras comprueba los datos en firebase
    // Swal.fire({
    //   title: 'Espere por favor',
    //   didOpen: () => {
    //     Swal.showLoading()
    //   }
    // });

    const { nombre, correo, password } = this.registroForm.value;
    //Aqui uso la autentificacion, y como es una promesa uso el then/catch:
    this.authService.crearUsuario(nombre, correo, password)
      .then(credenciales => {
        console.log(credenciales);

        // Swal.close();
        this.store.dispatch(ui.stopLoading()); //Aqui disparo parar la accion
        this.router.navigate(['/']);
      }).catch(error => {
        console.error(error);
        this.store.dispatch(ui.stopLoading()); //Tambien se dispara el parar la accion con el error

        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.message
        })
      });

  }

}
