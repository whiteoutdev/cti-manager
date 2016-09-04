import React from 'react';
import _ from 'lodash';

const PropTypes = React.PropTypes;

class PanelHeader extends React.Component {
    render() {
        const props = _.extend({}, this.props);
        props.className = props.className ? `PanelHeader ${props.className}` : 'PanelHeader';

        return (
            <div {...props}>
                {props.children}
            </div>
        );
    }
}

PanelHeader.propTypes = {
    children : PropTypes.node,
    className: PropTypes.string
};

export default PanelHeader;
