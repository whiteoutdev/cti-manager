import * as classNames from 'classnames';
import * as _ from 'lodash';
import * as React from 'react';
import {HTMLProps, ReactElement} from 'react';

export default class PanelButtons extends React.Component<HTMLProps<HTMLDivElement>, {}> {
    public render(): ReactElement<HTMLProps<HTMLDivElement>> {
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
