import * as React from 'react';
import {HotKeys} from 'react-hotkeys';
import {Route, Switch} from 'react-router-dom';

import keymap from '../../config/keymap.config';

import ImagePage from '../ImagePage/ImagePage';
import ImagesPage from '../ImagesPage/ImagesPage';
import InstructionsPage from '../InstructionsPage/InstructionsPage';
import LandingPage from '../LandingPage/LandingPage';
import LoginPage from '../LoginPage/LoginPage';
import TagsPage from '../TagsPage/TagsPage';

import {ReactElement} from 'react';
import './App.scss';

class App extends React.Component<{}, {}> {
    public render(): ReactElement<{}> {
        return (
            <HotKeys keyMap={keymap}>
                <div className='App'>
                    <Switch>
                        <Route exact path='/' component={LandingPage}/>
                        <Route path='/login' component={LoginPage}/>
                        <Route exact path='/media' component={ImagesPage}/>
                        <Route path='/media/:imageID' component={ImagePage}/>
                        <Route exact path='/tags' component={TagsPage}/>
                        <Route path='/tags/:tagID' component={TagsPage}/>
                        <Route path='/instructions' component={InstructionsPage}/>
                    </Switch>
                </div>
            </HotKeys>
        );
    }
}

export default App;
