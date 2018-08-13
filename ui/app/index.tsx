import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {HashRouter} from 'react-router-dom';

import App from './pages/App/App';

import 'material-design-icons/iconfont/material-icons.css';
import 'roboto-fontface';
import './index.scss';

const app = (
    <HashRouter>
        <App/>
    </HashRouter>
);

ReactDOM.render(app, document.getElementById('cti-manager-app'));
