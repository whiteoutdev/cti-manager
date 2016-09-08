import React from 'react';
import _ from 'lodash';

const PropTypes = React.PropTypes;

class PanelList extends React.Component {
    render() {
        const props = _.extend({}, this.props);
        props.className = props.className ? `PanelList ${props.className}` : 'PanelList';

        return (
            <ul {...props}>
                {props.children}
            </ul>
        );
    }
}

PanelList.propTypes = {
    children : PropTypes.node,
    className: PropTypes.string
};

export default PanelList;
