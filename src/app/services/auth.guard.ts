import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';
import { Observable, take, tap } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {

  constructor(private authService: AuthService,
    private router: Router) { }

  //Canload, parecido al canactivate pero para prevenir que no se carguen mas modulos de los que se tiene permiso.
  canLoad(): Observable<boolean> {
    return this.authService.isAuth().pipe(
      tap(estado => {
        if (!estado) { this.router.navigate(['/login']) }
      }),
      take(1) //Con canload necesitamos el metodo take para cancelar la subscripcion cuando ya ha cargado, 1 en este caso.
    );
  }

  canActivate(): Observable<boolean> {  //Me devuelve un observable que resuelve un booleano
    //Aqui necesito comprobar si es falso/true
    return this.authService.isAuth().pipe(  //Uso el metodo pipe para añadir operaciones encadenadas a un observable
      tap(estado => { //tap dispara un efecto secundario
        if (!estado) { this.router.navigate(['/login']) }
      })
    );
  }

}
