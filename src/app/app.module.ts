import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

//NGRX
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { appReducers } from './app.reducer';

//AngularFire
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';

//MODULOS
import { AppRoutingModule } from './app-routing.module';

// import { ReactiveFormsModule } from '@angular/forms';

// import { NgChartsModule } from 'ng2-charts';

import { AppComponent } from './app.component';

//Muevo el LoginComponent y RegisterComponent al modulo auth.module.ts
// import { LoginComponent } from './auth/login/login.component';
// import { RegisterComponent } from './auth/register/register.component';

// Estos modulos van a ir al ingresoEgreso.module.ts
// import { DashboardComponent } from './dashboard/dashboard.component';
// import { IngresoEgresoComponent } from './ingreso-egreso/ingreso-egreso.component';
// import { EstadisticaComponent } from './ingreso-egreso/estadistica/estadistica.component';
// import { DetalleComponent } from './ingreso-egreso/detalle/detalle.component';
// import { OrdenIngresoPipe } from './pipes/orden-ingreso.pipe';

//Movemos el footer, navbar y sidebar al shared.module.ts
// import { FooterComponent } from './shared/footer/footer.component';
// import { NavbarComponent } from './shared/navbar/navbar.component';
// import { SidebarComponent } from './shared/sidebar/sidebar.component';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

//Modulos
import { AuthModule } from './auth/auth.module';
// import { SharedModule } from './shared/shared.module';
// import { IngresoEgresoModule } from './ingreso-egreso/ingreso-egreso.module';


@NgModule({
  declarations: [
    AppComponent,
    // LoginComponent,
    // RegisterComponent,
    // DashboardComponent,
    // IngresoEgresoComponent,
    // EstadisticaComponent,
    // DetalleComponent,
    // OrdenIngresoPipe

    // FooterComponent,
    // NavbarComponent,
    // SidebarComponent,

  ],
  imports: [
    BrowserModule,

    AuthModule,
    // SharedModule, //Lo enviamos al ingreso-egreso.module.ts
    // IngresoEgresoModule,

    AppRoutingModule,
    // ReactiveFormsModule, //Al ingresoEgreso.module
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    // NgChartsModule,
    // provideFirebaseApp(() => initializeApp(environment.firebase)),
    // provideAuth(() => getAuth()),
    // provideFirestore(() => getFirestore()),
    StoreModule.forRoot(appReducers),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
      autoPause: true, // Pauses recording actions and state changes when the extension window is not open
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
