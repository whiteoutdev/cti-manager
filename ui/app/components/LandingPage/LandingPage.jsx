import React from 'react';
import {Link} from 'react-router-dom';

import appConfig from '../../config/app.config';

import './LandingPage.scss';

class LandingPage extends React.Component {
    render() {
        return (
            <div className="LandingPage">
                <h1 className="main-heading">{appConfig.appName}</h1>
                <ul className="landing-page-list">
                    <li className="landing-page-list-item">
                        <Link to="/media">
                            <i className="material-icons">image</i>
                            <span>View Media</span>
                        </Link>
                    </li>
                    <li className="landing-page-list-item">
                        <Link to="/tags">
                            <i className="material-icons">label</i>
                            <span>Search Tags</span>
                        </Link>
                    </li>
                    <li className="landing-page-list-item">
                        <Link to="/instructions">
                            <i className="material-icons">casino</i>
                            <span>View Instructions</span>
                        </Link>
                    </li>
                </ul>
            </div>
        );
    }
}

export default LandingPage;
