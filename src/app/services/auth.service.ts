import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import firebase from 'firebase/compat/app';

import { map } from 'rxjs';
import { Usuario } from '../modelos/usuario.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public auth: AngularFireAuth,
    public firestore: AngularFirestore) { }

  //Metodo para obtener los datos de usuario en firebase
  initAuthListener() {

    this.auth.authState.subscribe(fuser => {
      console.log(fuser);
      console.log(fuser?.uid);
      console.log(fuser?.email);



    })

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
