import * as React from 'react';
import * as _ from 'lodash';
import * as classNames from 'classnames';
import {HTMLProps} from 'react';

export default class PanelBody extends React.Component<HTMLProps<HTMLDivElement>, {}> {
    render() {
        const props = _.extend({}, this.props, {
            className: classNames('PanelBody', this.props.className)
        });

        return (
            <div {...props}>
                {props.children}
            </div>
        );
    }
}
