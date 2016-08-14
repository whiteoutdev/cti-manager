import React from 'react';
import _ from 'lodash';

export default class PanelHeader extends React.Component {
    render() {
        const props = _.extend({}, this.props);
        props.className = props.className ? `PanelHeader ${props.className}` : 'PanelHeader';

        return (
            <div {...props}>
                {props.children}
            </div>
        );
    }
};
