import * as React from 'react';
import {Component, ReactNode} from 'react';
import {MemoryRouter, Route, Switch} from 'react-router-dom';
import {HomePage} from './pages/HomePage/HomePage';
import {ImagesPage} from './pages/ImagesPage/ImagesPage';
import {ipcRenderer, IpcRendererEvent} from 'electron';

export class App extends Component {
    public componentDidMount(): void {
        console.log('App.componentDidMount');
        console.log(setInterval);

        ipcRenderer.on('is-alive', (event: IpcRendererEvent, value: boolean) => {
            console.log(`Pong: ${value}`);
        });

        setInterval(this.ping.bind(this), 5000);
    }

    public render(): ReactNode {
        return (
            <div className="App">
                <h1>App</h1>
                <MemoryRouter>
                    <Switch>
                        <Route path="/images" component={ImagesPage}/>
                        <Route path="/" component={HomePage}/>
                    </Switch>
                </MemoryRouter>
            </div>
        );
    }

    private async ping(): Promise<void> {
        console.log('ping');
        return new Promise((resolve) => {
            console.log('Pinging main...');
            ipcRenderer.send('is-alive', 'ping');
        });
    }
}
