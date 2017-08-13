// Type definitions for RefluxJS 0.4
// Project: https://github.com/reflux/refluxjs
// Definitions by: Maurice de Beijer <https://github.com/mauricedb>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

import {EventEmitter} from 'eventemitter3';
import * as React from 'react';

export as namespace Reflux;

/***************
 * Reflux Core *
 ***************/

export type PreEmit = (...args: any[]) => any;

export type ShouldEmit = (...args: any[]) => boolean;

export type Deferral = (resolve: Function, ...args: any[]) => void;

export interface ActionDefinition {
    actionName?: string;
    children?: string[];
    asyncResult?: boolean,
    sync?: boolean;
    preEmit?: PreEmit;
    shouldEmit?: ShouldEmit;
}

export interface Methods {
    [key: string]: Function;
}

export interface Listenable {
    listen(callback: Function, bindContext?: any): Function;
}

export interface Subscription {
    stop: Function;
    listenable: Listenable[] | Listenable;
}

interface JoinTrailing {
    joinTrailing(p1: Listenable, callback?: Function | string): Subscription;
    joinTrailing(p1: Listenable, p2: Listenable, callback?: Function | string): Subscription;
    joinTrailing(p1: Listenable, p2: Listenable, p3: Listenable, callback?: Function | string): Subscription;
    joinTrailing(p1: Listenable, p2: Listenable, p3: Listenable, p4: Listenable,
                 callback?: Function | string): Subscription;
    joinTrailing(p1: Listenable, p2: Listenable, p3: Listenable, p4: Listenable, p5: Listenable,
                 callback?: Function | string): Subscription;
}

interface JoinLeading {
    joinLeading(p1: Listenable, callback?: Function | string): Subscription;
    joinLeading(p1: Listenable, p2: Listenable, callback?: Function | string): Subscription;
    joinLeading(p1: Listenable, p2: Listenable, p3: Listenable, callback?: Function | string): Subscription;
    joinLeading(p1: Listenable, p2: Listenable, p3: Listenable, p4: Listenable,
                callback?: Function | string): Subscription;
    joinLeading(p1: Listenable, p2: Listenable, p3: Listenable, p4: Listenable, p5: Listenable,
                callback?: Function | string): Subscription;
}

interface JoinConcat {
    joinConcat(p1: Listenable, callback?: Function | string): Subscription;
    joinConcat(p1: Listenable, p2: Listenable, callback?: Function | string): Subscription;
    joinConcat(p1: Listenable, p2: Listenable, p3: Listenable, callback?: Function | string): Subscription;
    joinConcat(p1: Listenable, p2: Listenable, p3: Listenable, p4: Listenable,
               callback?: Function | string): Subscription;
    joinConcat(p1: Listenable, p2: Listenable, p3: Listenable, p4: Listenable, p5: Listenable,
               callback?: Function | string): Subscription;
}

interface JoinStrict {
    joinStrict(p1: Listenable, callback?: Function | string): Subscription;
    joinStrict(p1: Listenable, p2: Listenable, callback?: Function | string): Subscription;
    joinStrict(p1: Listenable, p2: Listenable, p3: Listenable, callback?: Function | string): Subscription;
    joinStrict(p1: Listenable, p2: Listenable, p3: Listenable, p4: Listenable,
               callback?: Function | string): Subscription;
    joinStrict(p1: Listenable, p2: Listenable, p3: Listenable, p4: Listenable, p5: Listenable,
               callback?: Function | string): Subscription;
}

export interface JoinMethods extends JoinTrailing, JoinLeading, JoinConcat, JoinStrict {
}

export interface ListenerMethods extends JoinMethods {
    fetchInitialState(): any;
    hasListener(listenable: Listenable): boolean;
    listenTo(listenable: Listenable, callback: Function | string, defaultCallback?: Function | string): Subscription;
    listenToMany(...listenables: {[methodName: string]: Function}[]): void;
    stopListeningTo(listenable: Listenable): boolean;
    stopListeningToAll(): void;
    validateListening(listenable: Listenable): string | undefined;
}

export interface PublisherMethods extends Listenable {
    deferWith(callback: Deferral): void;
    preEmit: PreEmit;
    shouldEmit: ShouldEmit;
    trigger(...args: any[]): void;
    triggerAsync(...args: any[]): void;
}

export interface RefluxAction extends PublisherMethods {
    (...args: any[]): any;
}

export interface RefluxStore extends ListenerMethods, PublisherMethods {
}

export interface RefluxCore extends JoinMethods {
    version: {[moduleName: string]: string};
    ActionMethods: Methods;
    ListenerMethods: ListenerMethods;
    PublisherMethods: PublisherMethods;
    StoreMethods: Methods;

    createAction(definition?: ActionDefinition): RefluxAction;
    createActions(definitions: string[] | {[name: string]: ActionDefinition}): {[name: string]: RefluxAction};
    createStore(definition: Methods): RefluxStore;
    nextTick(nextTick: Function): void;
    setEventEmitter(eventEmitter: EventEmitter): void;
    use(extension: Function): void;
}

/*************
 * Reflux JS *
 *************/

export class Component<P, S> extends React.Component<P, S> {
    store: Store<any>;
    stores: Store<any>[];
    storeKeys: string[];

    mapStoreToState<T>(store: Store<T>, filterFunc: (fromStore: T) => S): void;
}

export class Store<S> implements RefluxStore {
    state: S;
    listenables: {[methodName: string]: Listenable};

    setState(state: S): void;

    joinTrailing(p1: Listenable, callback?: Function | string): Subscription;
    joinTrailing(p1: Listenable, p2: Listenable, callback?: Function | string): Subscription;
    joinTrailing(p1: Listenable, p2: Listenable, p3: Listenable, callback?: Function | string): Subscription;
    joinTrailing(p1: Listenable, p2: Listenable, p3: Listenable, p4: Listenable,
                 callback?: Function | string): Subscription;
    joinTrailing(p1: Listenable, p2: Listenable, p3: Listenable, p4: Listenable, p5: Listenable,
                 callback?: Function | string): Subscription;

    joinLeading(p1: Listenable, callback?: Function | string): Subscription;
    joinLeading(p1: Listenable, p2: Listenable, callback?: Function | string): Subscription;
    joinLeading(p1: Listenable, p2: Listenable, p3: Listenable, callback?: Function | string): Subscription;
    joinLeading(p1: Listenable, p2: Listenable, p3: Listenable, p4: Listenable,
                callback?: Function | string): Subscription;
    joinLeading(p1: Listenable, p2: Listenable, p3: Listenable, p4: Listenable, p5: Listenable,
                callback?: Function | string): Subscription;

    joinConcat(p1: Listenable, callback?: Function | string): Subscription;
    joinConcat(p1: Listenable, p2: Listenable, callback?: Function | string): Subscription;
    joinConcat(p1: Listenable, p2: Listenable, p3: Listenable, callback?: Function | string): Subscription;
    joinConcat(p1: Listenable, p2: Listenable, p3: Listenable, p4: Listenable,
               callback?: Function | string): Subscription;
    joinConcat(p1: Listenable, p2: Listenable, p3: Listenable, p4: Listenable, p5: Listenable,
               callback?: Function | string): Subscription;

    joinStrict(p1: Listenable, callback?: Function | string): Subscription;
    joinStrict(p1: Listenable, p2: Listenable, callback?: Function | string): Subscription;
    joinStrict(p1: Listenable, p2: Listenable, p3: Listenable, callback?: Function | string): Subscription;
    joinStrict(p1: Listenable, p2: Listenable, p3: Listenable, p4: Listenable,
               callback?: Function | string): Subscription;
    joinStrict(p1: Listenable, p2: Listenable, p3: Listenable, p4: Listenable, p5: Listenable,
               callback?: Function | string): Subscription;

    fetchInitialState(): any;
    hasListener(listenable: Listenable): boolean;
    listenTo(listenable: Listenable, callback: Function | string, defaultCallback?: Function | string): Subscription;
    listenToMany(...listenables: {[methodName: string]: Function}[]): void;
    stopListeningTo(listenable: Listenable): boolean;
    stopListeningToAll(): void;
    validateListening(listenable: Listenable): string | undefined;

    deferWith(callback: Deferral): void;
    listen(callback: Function, bindContext?: any): Function;
    preEmit: PreEmit;
    shouldEmit: ShouldEmit;
    trigger(...args: any[]): void;
    triggerAsync(...args: any[]): void;
}

export interface ListenerMixin extends ListenerMethods {
    componentWillUnmount: Function;
}

export interface RefluxStatic extends RefluxCore {
    serverMode: boolean;
    ListenerMixin: ListenerMixin;

    connect<P, S>(listenable: Listenable, key: string): Component<P, S>;
    connectFilter<P, S>(listenable: Listenable, key: string, filterFunc: (obj: any) => boolean): Component<P, S>;
    listenTo<P, S>(listenable: Listenable, callback: Function, initial: Function): Component<P, S>;
    listenToMany<P, S>(...listenables: {[methodName: string]: Function}[]): Component<P, S>;
}

declare const Reflux: RefluxStatic;

export default Reflux;
