import { createReducer, on } from '@ngrx/store';
import { isLoading, stopLoading } from './ui.actions';

export interface State {
    isLoading: boolean;
}

export const initialState: State = {
    isLoading: false,
}

const _counterReducer = createReducer(initialState,

    on(isLoading, state => ({ ...state, isLoading: true })),
    on(stopLoading, state => ({ ...state, isLoading: false })),

);

export function counterReducer(state, action) {
    return _counterReducer(state, action);
}