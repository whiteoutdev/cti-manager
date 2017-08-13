import * as React from 'react';
import * as _ from 'lodash';
import * as classNames from 'classnames';
import {HTMLProps} from 'react';

export default class PanelListItem extends React.Component<HTMLProps<HTMLLIElement>, {}> {
    render() {
        const props = _.extend({}, this.props, {
            className: classNames('PanelListItem', this.props.className)
        });

        return (
            <li {...props}>
                {props.children}
            </li>
        );
    }
}
