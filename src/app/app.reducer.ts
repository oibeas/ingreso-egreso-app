import { ActionReducerMap } from '@ngrx/store';
import * as ui from './shared/ui.reducer';
import * as auth from './auth/auth.reducer';
import * as ingresoEgreso from './ingreso-egreso/ingreso-egreso.reducer'


export interface AppState {
    ui: ui.State,
    user: auth.State,
    // ingresosEgresos: ingresoEgreso.State
}



export const appReducers: ActionReducerMap<AppState> = {
    ui: ui.uiReducer,
    user: auth.authReducer,
    // ingresosEgresos: ingresoEgreso.ingresoEgresoReducer //Vamos a cambiar esto de sitio para cargarlo con lazyload y los features, para que no se tenga acceso a ello hasta haber hecho login. Lo llevamos a ingreso-egreso.module.ts
}