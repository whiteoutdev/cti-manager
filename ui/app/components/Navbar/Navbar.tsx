import * as React from 'react';
import {Link, NavLink} from 'react-router-dom';

import appConfig from '../../config/app.config';

import {ReactElement} from 'react';
import './Navbar.scss';

class Navbar extends React.Component<{}, {}> {
    public render(): ReactElement<{}> {
        return (
            <div className='Navbar'>
                <Link className='home-link' to='/'>
                    <h1>{appConfig.appName}</h1>
                </Link>
                <ul className='nav-link-list'>
                    <li className='nav-link-list-item'>
                        <NavLink to='/media' className='nav-link' activeClassName='active'>Media</NavLink>
                    </li>
                    <li className='nav-link-list-item'>
                        <NavLink className='nav-link' to='/tags' activeClassName='active'>Tags</NavLink>
                    </li>
                    <li className='nav-link-list-item'>
                        <NavLink className='nav-link' to='/instructions' activeClassName='active'>Instructions</NavLink>
                    </li>
                </ul>
            </div>
        );
    }
}

export default Navbar;
