import * as React from 'react';
import {Component, ReactNode} from 'react';
import {MemoryRouter, Route, Switch} from 'react-router-dom';
import {HomePage} from './pages/HomePage/HomePage';
import {ImagesPage} from './pages/ImagesPage/ImagesPage';

export class App extends Component<{}> {
    public render(): ReactNode {
        return (
            <div className="App">
                <MemoryRouter>
                    <Switch>
                        <Route path="/images" component={ImagesPage}/>
                        <Route path="/" component={HomePage}/>
                    </Switch>
                </MemoryRouter>
            </div>
        );
    }
}
