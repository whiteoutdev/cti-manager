import * as React from 'react';
import * as _ from 'lodash';
import * as classNames from 'classnames';
import {EventHandler, HTMLProps, MouseEvent} from 'react';

export default class PanelButton extends React.Component<HTMLProps<HTMLButtonElement>, {}> {
    render() {
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
