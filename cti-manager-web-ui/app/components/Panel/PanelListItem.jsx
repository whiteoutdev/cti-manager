import React from 'react';

export default class PanelListItem extends React.Component {
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
