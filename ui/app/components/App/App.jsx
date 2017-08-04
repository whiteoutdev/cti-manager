import React from 'react';
import {HotKeys} from 'react-hotkeys';
import {Route, Switch} from 'react-router-dom';
import PropTypes from 'prop-types';

import keymap from '../../config/keymap.config';

import LandingPage from '../LandingPage/LandingPage';
import ImagesPage from '../ImagesPage/ImagesPage';
import ImagePage from '../ImagePage/ImagePage';
import TagsPage from '../TagsPage/TagsPage';
import LoginPage from '../LoginPage/LoginPage';
import InstructionsPage from '../InstructionsPage/InstructionsPage';

import './App.scss';

class App extends React.Component {
    render() {
        return (
            <HotKeys keyMap={keymap}>
                <div className="App">
                    <Switch>
                        <Route exact path="/" component={LandingPage}/>
                        <Route path="/login" component={LoginPage}/>
                        <Route exact path="/media" component={ImagesPage}/>
                        <Route path="/media/:imageID" component={ImagePage}/>
                        <Route exact path="/tags" component={TagsPage}/>
                        <Route path="/tags/:tagID" component={TagsPage}/>
                        <Route path="/instructions" component={InstructionsPage}/>
                    </Switch>
                </div>
            </HotKeys>
        );
    }
}

App.propTypes = {
    children: PropTypes.node
};

export default App;
