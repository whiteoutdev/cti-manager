import * as classNames from 'classnames';
import * as _ from 'lodash';
import * as React from 'react';
import {HTMLProps, ReactElement} from 'react';

export default class PanelListItem extends React.Component<HTMLProps<HTMLLIElement>, {}> {
    public render(): ReactElement<HTMLProps<HTMLLIElement>> {
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
