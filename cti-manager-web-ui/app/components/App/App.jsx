import React from 'react';
import {HotKeys} from 'react-hotkeys';

import keymap from '../../config/keymap.config';

import './App.scss';

class App extends React.Component {
    render() {
        return (
            <HotKeys keyMap={keymap}>
                <div className="App">
                    {this.props.children}
                </div>
            </HotKeys>
        );
    }
}

App.propTypes = {
    children: React.PropTypes.node
};

export default App;
