import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';

import './Panel.scss';

class Panel extends React.Component {
    render() {
        const props = _.extend({}, this.props);
        props.className = props.className ? `Panel ${props.className}` : 'Panel';

        return (
            <div {...props}>
                {props.children}
            </div>
        );
    }
}

Panel.propTypes = {
    children : PropTypes.node,
    className: PropTypes.string
};

export default Panel;
