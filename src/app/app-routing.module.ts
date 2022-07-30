import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { dashboardRoutes } from './dashboard/dashboard.routes';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  //Estas rutas van para el dashboardRotes.module.ts
  // {
  //   path: '',
  //   component: DashboardComponent,
  //   children: dashboardRoutes,
  //   canActivate: [AuthGuard]
  // },

  //!Aqui cargamos el ingreso-egreso con LAZYLOAD
  {
    path: '',
    // canActivate: [AuthGuard], //si cargo el canactivate me carga el modulo
    canLoad: [AuthGuard], //con canLoad no carga el modulo
    loadChildren: () => import('./ingreso-egreso/ingreso-egreso.module')
      .then(m => m.IngresoEgresoModule)
    //Este es el lazyload, es una promesa que carga el modulo ingresoEgresoModule despues de cargar todo el archivo
  },

  { path: '**', redirectTo: '' },



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
