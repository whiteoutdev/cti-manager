import {Component} from 'react';

export function extractConnected<C extends Component<any, any>>(connector: any): C {
    if (!connector) {
        return;
    }
    const wrappedInstance = connector.getWrappedInstance && connector.getWrappedInstance();
    return wrappedInstance.component || wrappedInstance;
}
