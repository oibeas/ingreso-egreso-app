export class IngresoEgreso {

    constructor(
        public descripcion: string,
        public monto: number,
        public tipo: string,
        public uid?: string, //Se pone opcional porque lo voy a tener al crear un documento que viene de firebase, cuando lo cree en firebase ya no lo voy a tener
    ) { }
}