import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route} from 'react-router';

import App from './components/App/App.jsx';

import history from './services/history';

import './index.scss';

const routes = (
    <Router history={history}>
        <Route path="/" component={App}/>
    </Router>
);

ReactDOM.render(routes, document.getElementById('cti-manager-app'));
