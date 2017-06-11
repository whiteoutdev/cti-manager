import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter} from 'react-router-dom';

import App from './components/App/App.jsx';

import 'material-design-icons/iconfont/material-icons.css';
import 'roboto-fontface';
import './index.scss';

const routes = (
    <HashRouter>
        <App/>
    </HashRouter>
);

ReactDOM.render(routes, document.getElementById('cti-manager-app'));
