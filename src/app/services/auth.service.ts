import { Injectable } from '@angular/core';

import firebase from 'firebase/compat/app';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as authActions from '../auth/auth.actions';
import * as ingresoEgresoActions from '../ingreso-egreso/ingreso-egreso.actions';

import { map, Subscription } from 'rxjs';
import { Usuario } from '../modelos/usuario.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userSubscription: Subscription;
  private _user: Usuario; //Esta varible solo la voy a usar para leer el uid del usuario. La pongo privada porque no quiero que nadie acceda a ella, y un guin bajo porque voy a hacer un getter. Si es privada no va a teer acceso desde ningun otro sitio

  //Creo el getter
  get user() {
    return this._user;
  }

  constructor(public auth: AngularFireAuth,
    public firestore: AngularFirestore,
    private store: Store<AppState>,
  ) { }

  //Metodo para obtener los datos de usuario en firebase
  initAuthListener() {

    this.auth.authState.subscribe(fuser => {
      // console.log(fuser);
      // console.log(fuser?.uid);
      // console.log(fuser?.email);

      if (fuser) {
        //existe
        //Aqui disparamos la accion
        this.userSubscription = this.firestore.doc(`${fuser.uid}/usuario`).valueChanges()
          .subscribe((firestoreUser: any) => {

            // console.log(firestoreUser); //Aqui esta el uid del usuario logueado

            //Aqui almacenamos el usuario de firebase en el Store
            //Primero hay que convertirlo porque no lo puedo enviar como viene de firebase
            const user = Usuario.fromFirebase(firestoreUser);
            this._user = user; //Meto toda la info de firebase en la variable this.user que he creado
            this.store.dispatch(authActions.setUser({ user: user }));

          });

      } else {
        //no existe
        this._user = null; //Para limpiar la variable con los datos de usuario
        this.userSubscription.unsubscribe(); //Hay que desubscribirse al salir
        this.store.dispatch(authActions.unSetUser());
        this.store.dispatch(ingresoEgresoActions.unSetItems());
      }

    });

  }



  crearUsuario(nombre: string, email: string, password: string) {

    // console.log({ nombre, email, password });

    //Hemos inyectado el servicio para autentificar al usuario, ahora uso el metodo createUserWithEmailAndPassword:
    // return this.auth.createUserWithEmailAndPassword(email, password);
    return firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(({ user }) => {

        const newUser = new Usuario(user.uid, nombre, user.email)
        //Aqui le pasamos al firestore los datos
        return this.firestore.doc(`${user.uid}/usuario`).set({ ...newUser });

      })



  }

  loginUsuario(email: string, password: string) {

    console.log({ email, password });
    return firebase.auth().signInWithEmailAndPassword(email, password)
  }

  logout() {
    return this.auth.signOut();
  }

  isAuth() {
    // return this.auth.authState;  //Esto nos devuelve el estado del usuario en firebase, pero no como lo necesito, necesito un booleano, asi que le hago un pipe y le paso el metodo map para ver si existe el usuario
    return this.auth.authState.pipe(
      map(fbUser => fbUser != null)
    );
  }

}
