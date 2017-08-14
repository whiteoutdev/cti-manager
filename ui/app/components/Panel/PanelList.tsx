import * as classNames from 'classnames';
import * as _ from 'lodash';
import * as React from 'react';
import {HTMLProps, ReactElement} from 'react';

export default class PanelList extends React.Component<HTMLProps<HTMLUListElement>, {}> {
    public render(): ReactElement<HTMLProps<HTMLUListElement>> {
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
