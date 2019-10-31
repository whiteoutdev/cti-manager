import * as React from 'react';
import {Component, ReactNode} from 'react';
import {MemoryRouter, Route, Switch} from 'react-router-dom';
import {HomePage} from './pages/HomePage/HomePage';
import {ImagesPage} from './pages/ImagesPage/ImagesPage';
import {JsonService} from './services/ipc/JsonService';

export interface AppState {
    hello: string;
}

export class App extends Component<{}, AppState> {
    public state: AppState = {
        hello: '...',
    };

    private readonly jsonService = new JsonService();

    public componentDidMount(): void {
        setTimeout(() => this.sendHello(), 3000);
    }

    public render(): ReactNode {
        return (
            <div className="App">
                <h1>App</h1>
                <p>Hello: {this.state.hello}</p>
                <MemoryRouter>
                    <Switch>
                        <Route path="/images" component={ImagesPage}/>
                        <Route path="/" component={HomePage}/>
                    </Switch>
                </MemoryRouter>
            </div>
        );
    }

    private async sendHello(): Promise<void> {
        const hello = await this.jsonService.sendHello();
        this.setState({hello: hello.hello});
    }
}
