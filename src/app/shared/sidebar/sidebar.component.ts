import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit, OnDestroy {

  usuarioLogueado: string = "";
  userSubs: Subscription;

  constructor(private authService: AuthService,
    private router: Router,
    private store: Store<AppState>) { }

  ngOnInit(): void {
    this.userSubs = this.store.select('user')
      .pipe(
        filter(({ user }) => user != null) //Con el pipe+filter solo dejo pasar la propiedad si existe
      )
      .subscribe(({ user }) => { this.usuarioLogueado = user.nombre })
  }

  ngOnDestroy(): void {
    this.userSubs.unsubscribe();
  }

  logout() {

    //Pongo un alert de espera mientras comprueba los datos en firebase
    Swal.fire({
      title: 'Espere por favor',
      didOpen: () => {
        Swal.showLoading()
      }
    });

    this.authService.logout()
      .then(() => {
        setTimeout(() => {
          Swal.close(); //Aqui se cierra la alerta, cuando recibe los datos de la auth
          this.router.navigate(['/login']);

        }, 1000);
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
