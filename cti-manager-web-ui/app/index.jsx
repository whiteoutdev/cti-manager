import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, IndexRoute} from 'react-router';

import App from './components/App/App.jsx';
import LandingPage from './components/LandingPage/LandingPage.jsx';
import ImagesPage from './components/ImagesPage/ImagesPage.jsx';

import history from './services/history';

import 'roboto-fontface';
import './index.scss';

const routes = (
    <Router history={history}>
        <Route path="/" component={App}>
            <IndexRoute component={LandingPage}/>
            <Route path="/images" component={ImagesPage}>
                <Route path="/images/:imageID"/>
            </Route>
        </Route>
    </Router>
);

ReactDOM.render(routes, document.getElementById('cti-manager-app'));
