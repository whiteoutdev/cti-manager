import * as React from 'react';
import {Component} from 'reflux';
import * as _ from 'lodash';

abstract class AbstractComponent<P, S> extends React.Component<P, S> {
    protected abstract defaultProps(): P;

    protected getProps(props?: P): P {
        props = props || this.props;
        return _.extend({}, this.defaultProps(), _.omitBy(props, _.isNil));
    }
}

abstract class AbstractRefluxComponent<P, S> extends Component<P, S> {
    protected abstract defaultProps(): P;

    protected getProps(props?: P): P {
        props = props || this.props;
        return _.extend({}, this.defaultProps(), _.omitBy(props, _.isNil));
    }
}

export {AbstractComponent, AbstractRefluxComponent};
