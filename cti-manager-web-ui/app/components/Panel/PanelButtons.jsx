import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';

class PanelButtons extends React.Component {
    render() {
        const props = _.extend({}, this.props);
        props.className = props.className ? `PanelButtons ${props.className}` : 'PanelButtons';

        return (
            <div className="PanelButtons">
                {this.props.children}
            </div>
        );
    }
}

PanelButtons.propTypes = {
    children : PropTypes.node,
    className: PropTypes.string
};

export default PanelButtons;
