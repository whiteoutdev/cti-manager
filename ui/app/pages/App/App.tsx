import * as React from 'react';
import {ReactNode} from 'react';
import {HotKeys} from 'react-hotkeys';
import {Provider} from 'react-redux';
import {Route, Switch} from 'react-router-dom';
import {AbstractRefluxComponent} from '../../components/AbstractComponent/AbstractComponent';
import keymap from '../../config/keymap.config';
import {store} from '../../redux/store';
import {UserStore} from '../../stores/UserStore';
import {ImagePageConnector} from '../ImagePage/ImagePageConnector';
import {ImagesPageConnector} from '../ImagesPage/ImagesPageConnector';
import InstructionsPage from '../InstructionsPage/InstructionsPage';
import LandingPage from '../LandingPage/LandingPage';
import {LoginPageConnector} from '../LoginPage/LoginPageConnector';
import TagsPage from '../TagsPage/TagsPage';
import './App.scss';

class App extends AbstractRefluxComponent<{}, {}> {
    constructor(props: object) {
        super(props);
        this.store = UserStore;
    }

    public render(): ReactNode {
        return (
            <HotKeys keyMap={keymap}>
                <Provider store={store}>
                    <div className='App'>
                        <Switch>
                            <Route exact path='/' component={LandingPage}/>
                            <Route path='/login' component={LoginPageConnector}/>
                            <Route exact path='/media' component={ImagesPageConnector}/>
                            <Route path='/media/:imageID' component={ImagePageConnector}/>
                            <Route exact path='/tags' component={TagsPage}/>
                            <Route path='/tags/:tagID' component={TagsPage}/>
                            <Route path='/instructions' component={InstructionsPage}/>
                        </Switch>
                    </div>
                </Provider>
            </HotKeys>
        );
    }

    protected getBaseProps(): {} {
        return {};
    }
}

export default App;
