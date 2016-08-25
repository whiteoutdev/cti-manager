import React from 'react';
import {Link} from 'react-router';

import NavLink from '../NavLink/NavLink.jsx';

import appConfig from '../../config/app.config';

import './Navbar.scss';

export default class Navbar extends React.Component {
    render() {
        return (
            <div className="Navbar">
                <Link className="home-link" to="/">
                    <h1>{appConfig.appName}</h1>
                </Link>
                <ul className="nav-link-list">
                    <li className="nav-link-list-item">
                        <NavLink to="/images" className="nav-link">Images</NavLink>
                    </li>
                </ul>
            </div>
        );
    }
}
