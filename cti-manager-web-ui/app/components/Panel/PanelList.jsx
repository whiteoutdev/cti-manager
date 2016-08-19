import React from 'react';

export default class PanelList extends React.Component {
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
