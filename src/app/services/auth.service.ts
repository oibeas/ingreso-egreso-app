import { Injectable } from '@angular/core';

import firebase from 'firebase/compat/app';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as authActions from '../auth/auth.actions';

import { map, Subscription } from 'rxjs';
import { Usuario } from '../modelos/usuario.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userSubscription: Subscription;

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

            console.log(firestoreUser);

            //Aqui almacenamos el usuario de firebase en el Store
            //Primero hay que convertirlo porque no lo puedo enviar como viene de firebase
            const user = Usuario.fromFirebase(firestoreUser);
            this.store.dispatch(authActions.setUser({ user: user }));
          });

      } else {
        //no existe
        this.userSubscription.unsubscribe(); //Hay que desubscribirse al salir
        this.store.dispatch(authActions.unSetUser());

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
