import React from 'react';
import _ from 'lodash';

const PropTypes = React.PropTypes;

class PanelListItem extends React.Component {
    render() {
        const props = _.extend({}, this.props);
        props.className = props.className ? `PanelListItem ${props.className}` : 'PanelListItem';

        return (
            <li {...props}>
                {props.children}
            </li>
        );
    }
}

PanelListItem.propTypes = {
    children : PropTypes.node,
    className: PropTypes.string
};

export default PanelListItem;
