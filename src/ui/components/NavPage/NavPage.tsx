import * as classNames from 'classnames';
import * as React from 'react';
import {HTMLAttributes, ReactNode} from 'react';
import {Nav} from '../Nav/Nav';

export interface NavPageProps extends HTMLAttributes<HTMLDivElement> {
}

export class NavPage extends React.Component<NavPageProps> {
    public render(): ReactNode {
        return (
            <div {...this.props} className={classNames('NavPage', this.props.className)}>
                <Nav/>
                <div className="nav-page-content">
                    {this.props.children}
                </div>
            </div>
        );
    }
}
