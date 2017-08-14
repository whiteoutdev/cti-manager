import * as classNames from 'classnames';
import * as _ from 'lodash';
import * as React from 'react';
import {HTMLProps, ReactElement} from 'react';

export default class PanelButton extends React.Component<HTMLProps<HTMLButtonElement>, {}> {
    public render(): ReactElement<HTMLProps<HTMLButtonElement>> {
        const props = _.extend({}, this.props, {
            className: classNames('PanelButton', this.props.className),
            onClick  : this.props.onClick || _.noop
        });

        return (
            <button {...props}>
                {props.children}
            </button>
        );
    }
}
