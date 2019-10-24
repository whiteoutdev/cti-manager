import {isNil, omitBy} from 'lodash';
import * as React from 'react';
import {Component, Store} from 'reflux';

abstract class AbstractComponent<P, S = {}> extends React.Component<P, S> {
    protected abstract getBaseProps(): P;

    protected getProps(props?: P): P {
        props = props || this.props;
        return Object.assign({}, this.getBaseProps(), omitBy(props, isNil));
    }
}

abstract class AbstractRefluxComponent<P, S> extends Component<typeof Store, P, S> {
    protected abstract getBaseProps(): P;

    protected getProps(props?: P): P {
        props = props || this.props;
        return Object.assign({}, this.getBaseProps(), omitBy(props, isNil));
    }
}

export {AbstractComponent, AbstractRefluxComponent};
