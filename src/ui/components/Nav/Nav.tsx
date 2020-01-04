import * as classNames from 'classnames';
import * as React from 'react';
import {HTMLAttributes, ReactNode} from 'react';

export interface NavProps extends HTMLAttributes<HTMLElement> {
}

export class Nav extends React.Component<NavProps> {
    public render(): ReactNode {
        return (
            <nav {...this.props} className={classNames('Nav', this.props.className)}>
                Nav
            </nav>
        );
    }
}
