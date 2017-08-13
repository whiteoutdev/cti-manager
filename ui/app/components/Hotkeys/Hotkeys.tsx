import * as React from 'react';
import {HotKeys as ReactHotkeys} from 'react-hotkeys';

// Workaround class to allow HTMLProps to be passed in to the React HotKeys component without compiler errors
export default class Hotkeys extends React.Component<any, {}> {
    render() {
        return <ReactHotkeys {...this.props}/>;
    }
}
