import { Component, OnDestroy, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as ingresoEgresoActions from '../ingreso-egreso/ingreso-egreso.actions';

import { filter, Subscription } from 'rxjs';

import { IngresoEgresoService } from '../services/ingreso-egreso.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit, OnDestroy {

  userSubs: Subscription;
  ingresosSubs: Subscription;

  //Vamos a conseguir el uid del usuario aqui para estar atentos a las colecciones del firebase
  constructor(private store: Store<AppState>,
    private ingresoEgresoService: IngresoEgresoService) { }

  ngOnInit() {

    //Cuando tenga el uid me pongo a escuchar, pero la primera vez es null y tengo que escluirla. Como esto es un abservable puedo pasarlo por un pipe para transformarlo
    //Si el usuario cierra sesion tengo que limpiar todo esto:
    this.userSubs = this.store.select('user')
      .pipe(
        filter(auth => auth.user != null) //Si el user del auth no es null, pasa
      )
      .subscribe(({ user }) => {
        console.log(user);
        //Aqui recibimos los datos de la coleccion del firestore a traves del servicio y dispara la accion, pero necesito un nuevo subscribe
        this.ingresosSubs = this.ingresoEgresoService.initIngresosEgresosListener(user.uid)
          .subscribe(ingresosEgresosFB => {
            // console.log(ingresosEgresosFB);

            //Disparamos la accion cuando nos llegue la data
            this.store.dispatch(ingresoEgresoActions.setItems({ items: ingresosEgresosFB }))

          })
      });

  }

  ngOnDestroy(): void {
    this.ingresosSubs?.unsubscribe(); //Para desubscribirme cuando abandone la pagina
    this.userSubs?.unsubscribe(); //Para desubscribirme cuando abandone la pagina
    //Con la interrogacion solo se ejecuta si existe
  }

}
