import React from 'react';
import {Link} from 'react-router';

import appConfig from '../../config/app.config';

import './Navbar.scss';

export default class Navbar extends React.Component {
    render() {
        return (
            <div className="Navbar">
                <Link className="home-link" to="/">
                    <h1>{appConfig.appName}</h1>
                </Link>
            </div>
        );
    }
}
