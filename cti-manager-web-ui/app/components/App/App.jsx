import React from 'react';
import {HotKeys} from 'react-hotkeys';

import keymap from '../../config/keymap.config';

import './App.scss';

export default class App extends React.Component {
    render() {
        return (
            <HotKeys keyMap={keymap}>
                <div className="App">
                    {this.props.children}
                </div>
            </HotKeys>
        );
    }
};
