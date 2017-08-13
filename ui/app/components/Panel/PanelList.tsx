import * as React from 'react';
import * as _ from 'lodash';
import * as classNames from 'classnames';
import {HTMLProps} from 'react';

export default class PanelList extends React.Component<HTMLProps<HTMLUListElement>, {}> {
    render() {
        const props = _.extend({}, this.props, {
            className: classNames('PanelList', this.props.className)
        });

        return (
            <ul {...props}>
                {props.children}
            </ul>
        );
    }
}
