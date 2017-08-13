import * as React from 'react';
import * as _ from 'lodash';
import * as classNames from 'classnames';
import {HTMLProps} from 'react';

export default class PanelButtons extends React.Component<HTMLProps<HTMLDivElement>, {}> {
    render() {
        const props = _.extend({}, this.props, {
            className: classNames('PanelButtons', this.props.className)
        });

        return (
            <div {...props}>
                {this.props.children}
            </div>
        );
    }
}
