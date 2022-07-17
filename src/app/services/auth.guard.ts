import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService,
    private router: Router) { }

  canActivate(): Observable<boolean> {  //Me devuelve un observable que resuelve un booleano
    //Aqui necesito comprobar si es falso/true
    return this.authService.isAuth().pipe(  //Uso el metodo pipe para añadir operaciones encadenadas a un observable
      tap(estado => { //tap dispara un efecto secundario
        if (!estado) { this.router.navigate(['/login']) }
      })
    );
  }

}
