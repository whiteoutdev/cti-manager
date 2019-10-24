import * as classNames from 'classnames';
import * as _ from 'lodash';
import * as React from 'react';
import {HTMLProps, ReactElement} from 'react';

export default class PanelHeader extends React.Component<HTMLProps<HTMLDivElement>, {}> {
    public render(): ReactElement<HTMLProps<HTMLDivElement>> {
        const props = _.extend({}, this.props, {
            className: classNames('PanelHeader', this.props.className)
        });

        return (
            <div {...props}>
                {props.children}
            </div>
        );
    }
}
