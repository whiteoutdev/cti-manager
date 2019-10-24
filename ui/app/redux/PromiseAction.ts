import {Action} from 'redux';

export interface PayloadAction<T> extends Action {
    payload: T;
}

export abstract class PromiseAction<T> implements PayloadAction<Promise<T>> {
    public payload: Promise<T>;
    public status: string;

    constructor(public readonly type: string) {
    }
}
