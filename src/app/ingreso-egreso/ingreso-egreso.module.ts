import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';

import { DashboardRoutesModule } from '../dashboard/dashboard-routes.module';
import { SharedModule } from '../shared/shared.module';

import { DashboardComponent } from '../dashboard/dashboard.component';
import { DetalleComponent } from './detalle/detalle.component';
import { EstadisticaComponent } from './estadistica/estadistica.component';
import { IngresoEgresoComponent } from './ingreso-egreso.component';
import { OrdenIngresoPipe } from '../pipes/orden-ingreso.pipe';

import { StoreModule } from '@ngrx/store';
import { ingresoEgresoReducer } from './ingreso-egreso.reducer';




@NgModule({
  declarations: [
    DashboardComponent,
    IngresoEgresoComponent,
    EstadisticaComponent,
    DetalleComponent,
    OrdenIngresoPipe
  ],
  imports: [
    CommonModule,
    StoreModule.forFeature('ingresosEgresos', ingresoEgresoReducer),  //Hemos traido el store de ingreso-egresos aqui, y lo cargamos con forfeature, forRoot es solo para el general
    ReactiveFormsModule,
    NgChartsModule,
    SharedModule, //Tenemos que cargar aqui el shared modulo porque cargamos el sidebar, footer y navbar
    DashboardRoutesModule,

  ]
})
export class IngresoEgresoModule { }
