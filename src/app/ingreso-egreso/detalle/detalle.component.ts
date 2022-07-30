import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { IngresoEgreso } from 'src/app/modelos/ingreso-egreso.model';
import { IngresoEgresoService } from 'src/app/services/ingreso-egreso.service';
import Swal from 'sweetalert2';
import { AppStateWithIngreso } from '../ingreso-egreso.reducer';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: [
  ]
})
export class DetalleComponent implements OnInit, OnDestroy {

  ingresosEgresos: IngresoEgreso[] = [];
  ingresosSubs: Subscription;

  constructor(private store: Store<AppStateWithIngreso>,
    private ingresoEgresoService: IngresoEgresoService) { }

  ngOnInit(): void {
    this.ingresosSubs = this.store.select('ingresosEgresos')
      // .subscribe(ingresosEgreso => this.ingresosEgresos = [...ingresosEgreso.items]); //Esta linea se subscribe y lo que retorna (los items) lo establece a esta propiedad del componente que es ingresosEgresos. Luego hay que hacer el unsubscribe
      .subscribe(({ items }) => this.ingresosEgresos = [...items]);
  }

  ngOnDestroy(): void {
    this.ingresosSubs.unsubscribe();
  }

  borrar(uid: string) {
    // console.log(uid);
    this.ingresoEgresoService.borrarIngresoEgreso(uid) //Esto es una promesa y ahora lo gestiono
      .then(() => Swal.fire('Borrado', 'Item  borrado', 'success'))
      .catch(err => Swal.fire('Error', err.message, 'error'))

  }

}
