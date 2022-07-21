import { createAction, props } from '@ngrx/store';
import { Usuario } from '../modelos/usuario.model';

//Esta accion es para crear el usuario
export const setUser = createAction(
    '[Auth] setUser',
    props<{ user: Usuario }>(),
);

//Esta otra es para quitar el usuario activo
export const unSetUser = createAction(
    '[Auth] unSetUser',
);