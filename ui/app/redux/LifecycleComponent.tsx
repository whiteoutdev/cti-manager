import * as React from 'react';
import {Component, ErrorInfo, ReactNode} from 'react';

export interface LifecycleProps {
    component: typeof Component;
    componentDidMount?: () => void;
    shouldComponentUpdate?: (nextProps: any, nextState: any, nextContext: any) => boolean;
    componentWillUnmount?: () => void;
    componentDidCatch?: (error: Error, errorInfo: ErrorInfo) => void;
    getSnapshotBeforeUpdate?: (prevProps: any, prevState: any) => any | null;
    componentDidUpdate?: (prevProps: any, prevState: any, snapshot: any) => void;
}

export class LifecycleComponent<S = {}, SS = any> extends Component<LifecycleProps, S, SS> {
    public component: Component;

    public componentDidMount(): void {
        this.callLifecycleMethod(this.props.componentDidMount);
    }

    public shouldComponentUpdate(nextProps: Readonly<LifecycleProps>, nextState: Readonly<S>, nextContext: any): boolean {
        return this.callLifecycleMethod(this.props.shouldComponentUpdate, nextProps, nextState, nextContext) || true;
    }

    public componentWillUnmount(): void {
        this.callLifecycleMethod(this.props.componentWillUnmount);
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        this.callLifecycleMethod(this.props.componentDidCatch, error, errorInfo);
    }

    public getSnapshotBeforeUpdate(prevProps: Readonly<LifecycleProps>, prevState: Readonly<S>): SS | null {
        return this.callLifecycleMethod(this.props.getSnapshotBeforeUpdate, prevProps, prevState) || null;
    }

    public componentDidUpdate(prevProps: Readonly<LifecycleProps>, prevState: Readonly<S>, snapshot?: SS): void {
        this.callLifecycleMethod(this.props.componentDidUpdate, prevProps, prevState, snapshot);
    }

    public render(): ReactNode {
        const Comp = this.props.component;
        return <Comp ref={comp => this.component = comp} {...this.props}/>;
    }

    private callLifecycleMethod(method: (...args: any[]) => any, ...args: any[]): any {
        if (method && method.call) {
            return method.call(this, ...args);
        }
    }
}
