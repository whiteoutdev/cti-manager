import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {App} from './App';
import './index.scss';

export function startApp(): void {
    ReactDOM.render(<App/>, document.getElementById('cti-manager'));
}
