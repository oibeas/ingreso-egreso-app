import { Injectable } from '@angular/core';
import 'firebase/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IngresoEgreso } from '../modelos/ingreso-egreso.model';
import { AuthService } from './auth.service';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IngresoEgresoService {

  constructor(private firestore: AngularFirestore,
    private authService: AuthService) { }

  crearIngresoEgreso(ingresoEgreso: IngresoEgreso) {
    const uid = this.authService.user.uid;

    delete ingresoEgreso.uid; //Nos asegurando de borrar la propiedad uid porque nos da error al crear ingresos/egresos

    //Aqui hacemos la inserccion en firebase de una coleccion, pero necesitamos primero el uid del usuario
    return this.firestore.doc(`${uid}/ingresos-egresos`)
      .collection('items')
      .add({ ...ingresoEgreso })
    // .then((ref) => console.log('exito!', ref))
    // .catch(err => console.warn(err));

  }

  //Creo un metodo en el servicio para esta atento a los cambios de ingresos egresos en la coleccion de firebase, y lo pongo a escuchar.
  initIngresosEgresosListener(uid: string) {

    //Necesito obtener la informacion a traves de firestore. Y todo esto regresa un observable
    return this.firestore.collection(`${uid}/ingresos-egresos/items`)
      .snapshotChanges() //Cambio el valuechanges por snapshotchanges para poder sacar el uid de ahi
      .pipe( //Lo paso por un pipe para poder transformar la informacion y conseguir el uid
        map(snapshot => { //El map sirve para retornar lo que sea
          return snapshot.map(doc => { //Con este otro map barro el array y retorno lo que quiera

            return {
              uid: doc.payload.doc.id, //Aqui esta el uid
              //Me falta la data
              ...doc.payload.doc.data() as any //Con el metodo data() lo saco y necesita el tipo
            }
          })
        })
      )
    // .subscribe(algo => { //Aqui conseguimos la coleccion de ingresos-egresos
    //   console.log(algo);
    // })

  }


  borrarIngresoEgreso(uidItem: string) {
    const uid = this.authService.user.uid; //Aqui saco el uid del usuario
    return this.firestore.doc(`${uid}/ingresos-egresos/items/${uidItem}`).delete(); //El metodo delete() regresa una promesa, entonces pongo un return y ya lo gestionare
  }

}
