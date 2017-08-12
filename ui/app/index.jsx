import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter} from 'react-router-dom';

import App from './components/App/App.jsx';
import history from './services/history';

import 'material-design-icons/iconfont/material-icons.css';
import 'roboto-fontface';
import './index.scss';

const routes = (
    <HashRouter history={history}>
        <App/>
    </HashRouter>
);

ReactDOM.render(routes, document.getElementById('cti-manager-app'));