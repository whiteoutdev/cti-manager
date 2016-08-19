import React from 'react';
import _ from 'lodash';

export default class PanelButton extends React.Component {
    render() {
        const props = _.extend({}, this.props);
        props.className = props.className ? `PanelButton ${props.className}` : 'PanelButton';
        props.onClick = props.onClick || _.noop;

        return (
            <button {...props}>
                {props.children}
            </button>
        );
    }
}
