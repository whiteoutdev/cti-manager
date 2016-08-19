import React from 'react';

export default class PanelButtons extends React.Component {
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
