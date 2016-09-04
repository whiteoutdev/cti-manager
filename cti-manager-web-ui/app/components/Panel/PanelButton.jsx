import React from 'react';
import _ from 'lodash';

const PropTypes = React.PropTypes;

class PanelButton extends React.Component {
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

PanelButton.propTypes = {
    children : PropTypes.node,
    className: PropTypes.string
};

export default PanelButton;
