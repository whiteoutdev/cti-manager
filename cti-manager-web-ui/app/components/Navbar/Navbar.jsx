import React from 'react';

import appConfig from '../../config/app.config';

import './Navbar.scss';

export default class Navbar extends React.Component {
    render() {
        return (
            <div className="Navbar">
                <h1>{appConfig.appName}</h1>
            </div>
        );
    }
}
