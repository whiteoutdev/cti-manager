import React from 'react';
import _ from 'lodash';

export default class PanelBody extends React.Component {
    render() {
        const props = _.extend({}, this.props);
        props.className = props.className ? `PanelBody ${props.className}` : 'PanelBody';

        return (
            <div {...props}>
                {props.children}
            </div>
        );
    }
};
