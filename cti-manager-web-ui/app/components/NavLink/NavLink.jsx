import React from 'react';
import {Link} from 'react-router';

import './NavLink.scss';

export default class NavLink extends React.Component {
    render() {
        const className = this.props.className ? `NavLink ${this.props.className}` : 'NavLink';
        return <Link {...this.props} className={className} activeClassName="active"/>;
    }
};
