import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from '../app.reducer';
import * as ui from 'src/app/shared/ui.actions';

import { IngresoEgreso } from '../modelos/ingreso-egreso.model';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: [
  ]
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {

  ingresoForm: FormGroup;
  tipo: string = 'ingreso';
  cargando: boolean = false;
  loadingSubs: Subscription;

  constructor(private fb: FormBuilder,
    private ingresoEgresoService: IngresoEgresoService,
    private store: Store<AppState>) { }

  ngOnInit(): void {

    //Aqui nos subscribimos al ui para ver el cambio de estado a isLoading
    this.loadingSubs = this.store.select('ui')
      .subscribe(({ isLoading }) => this.cargando = isLoading);
    // console.log('Estoy cargando 2500ms');


    this.ingresoForm = this.fb.group({
      descripcion: ['', Validators.required],
      monto: ['', Validators.required],
    })
  }


  ngOnDestroy(): void { //Nos desubscribimos al abandonar la pagina
    this.loadingSubs.unsubscribe();
  }

  guardar() {

    if (this.ingresoForm.invalid) { return };

    this.store.dispatch(ui.isLoading());

    // console.log(this.ingresoForm.value);
    // console.log(this.tipo);

    const { descripcion, monto } = this.ingresoForm.value; //Desestructuro el formulario para enviarlo al nuevo IngresoEgreso

    const ingresoEgreso = new IngresoEgreso(descripcion, monto, this.tipo); //Le doy los datos que tengo del formulario y le añado el tipo

    //Ahora con el servicio lo inserto en firebase
    this.ingresoEgresoService.crearIngresoEgreso(ingresoEgreso)
      .then(() => {
        this.ingresoForm.reset();
        this.store.dispatch(ui.stopLoading());
        Swal.fire('Registro creado', descripcion, 'success')
      })
      .catch(err => {
        this.store.dispatch(ui.stopLoading());
        Swal.fire('Error', err.message, 'error');
      })
  }

}
