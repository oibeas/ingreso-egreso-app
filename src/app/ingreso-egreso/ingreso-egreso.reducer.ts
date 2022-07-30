import { createReducer, on } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { IngresoEgreso } from '../modelos/ingreso-egreso.model';
import { setItems, unSetItems } from './ingreso-egreso.actions';

export interface State {
    items: IngresoEgreso[];
}

//Creo una interface auxiliar para poder manejar el state con el store de ingresosEgresos, ahora que lo cargo con retardo
export interface AppStateWithIngreso extends AppState {
    ingresosEgresos: State
}



export const initialState: State = {
    items: [],
}

const _ingresoEgresoReducer = createReducer(initialState,

    on(setItems, (state, { items }) => ({ ...state, items: [...items] })),
    on(unSetItems, state => ({ ...state, items: [] })),

);

export function ingresoEgresoReducer(state, action) {
    return _ingresoEgresoReducer(state, action);
}