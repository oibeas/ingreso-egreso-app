export class Usuario {


    //Me voy a crear un metodo estatico solo para convertir y almacenar el usuario que viene de firebase
    static fromFirebase({ email, uid, nombre }) {
        return new Usuario(uid, nombre, email);
    }



    constructor(
        public uid: string,
        public nombre: string,
        public email: string,

    ) { }

}