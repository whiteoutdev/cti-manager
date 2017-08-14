import * as classNames from 'classnames';
import * as _ from 'lodash';
import * as React from 'react';

import {HTMLProps, ReactElement} from 'react';
import './Panel.scss';

export default class Panel extends React.Component<HTMLProps<HTMLDivElement>, {}> {
    public render(): ReactElement<HTMLProps<HTMLDivElement>> {
        const props = _.extend({}, this.props, {
            className: classNames('Panel', this.props.className)
        });

        return (
            <div {...props}>
                {props.children}
            </div>
        );
    }
}
