import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, IndexRoute} from 'react-router';

import App from './components/App/App.jsx';
import LandingPage from './components/LandingPage/LandingPage.jsx';
import ImagesPage from './components/ImagesPage/ImagesPage.jsx';
import ImagePage from './components/ImagePage/ImagePage.jsx';
import TagsPage from './components/TagsPage/TagsPage.jsx';

import history from './services/history';

import 'material-design-icons/iconfont/material-icons.css';
import 'roboto-fontface';
import './index.scss';

const routes = (
    <Router history={history}>
        <Route path="/" component={App}>
            <IndexRoute component={LandingPage}/>
            <Route path="/media" component={ImagesPage}/>
            <Route path="/media/:imageID" component={ImagePage}/>
            <Route path="/tags" component={TagsPage}/>
            <Route path="/tags/:tagID" component={TagsPage}/>
        </Route>
    </Router>
);

ReactDOM.render(routes, document.getElementById('cti-manager-app'));
