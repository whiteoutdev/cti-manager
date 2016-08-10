import React from 'react';
import Reflux from 'reflux';
import _ from 'lodash';

export default class RefluxComponent extends React.Component {
    constructor() {
        super();
        _.forOwn(Reflux.ListenerMixin, (value, key) => {
            this[key] = value;
        });
    }
};
