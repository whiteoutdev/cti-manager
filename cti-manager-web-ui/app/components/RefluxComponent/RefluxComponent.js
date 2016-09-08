import React from 'react';
import Reflux from 'reflux';
import _ from 'lodash';

class RefluxComponent extends React.Component {
    constructor() {
        super();
        _.forOwn(Reflux.ListenerMixin, (value, key) => {
            this[key] = value;
        });
    }
}

export default RefluxComponent;
