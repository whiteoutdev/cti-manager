import * as React from 'react';
import * as _ from 'lodash';

import './EditableLink.scss';
import {AbstractComponent} from '../AbstractComponent/AbstractComponent';
import Hotkeys from '../Hotkeys/Hotkeys';

interface EditableLinkProps {
    onSave: (value: string) => void,
    display: string;
    link: string;
}

interface EditableLinkState {
    editMode: boolean;
}

class EditableLink extends AbstractComponent<EditableLinkProps, EditableLinkState> {
    private editableInput: HTMLInputElement;

    constructor() {
        super();
        this.state = {
            editMode: false
        };
    }

    toggleEditMode() {
        return new Promise((resolve) => {
            this.setState({
                editMode: !this.state.editMode
            }, () => {
                resolve();
            });
        });
    }

    fireSave() {
        const newValue = this.editableInput.value;
        this.toggleEditMode().then(() => {
            this.getProps().onSave(newValue);
        });
    }

    componentDidUpdate() {
        if (this.state.editMode) {
            this.editableInput.select();
        }
    }

    renderEditor() {
        return (
            <Hotkeys className="link-form" handlers={{enter: this.fireSave.bind(this)}}>
                <input type="text"
                       className="link-input with-addon"
                       ref={input => this.editableInput = input}
                       defaultValue={this.getProps().display}
                       onBlur={this.toggleEditMode.bind(this)}/>
                <button className="accent" onClick={this.fireSave.bind(this)}>
                    <i className="material-icons">done</i>
                </button>
            </Hotkeys>
        );
    }

    renderLink() {
        if (this.getProps().link && this.getProps().display) {
            return (
                <div className="link-display">
                    <a href={this.getProps().link}>{this.getProps().display}</a>
                    <i className="material-icons edit-button" onClick={this.toggleEditMode.bind(this)}>edit</i>
                </div>
            );
        } else {
            return (
                <div className="link-display">
                    <span>None</span>
                    <i className="material-icons edit-button" onClick={this.toggleEditMode.bind(this)}>edit</i>
                </div>
            );
        }
    }

    renderContent() {
        if (this.state.editMode) {
            return this.renderEditor();
        } else {
            return this.renderLink();
        }
    }

    render() {
        return (
            <div className="EditableLink">
                {this.renderContent()}
            </div>
        );
    }

    protected defaultProps(): EditableLinkProps {
        return {
            onSave : _.noop,
            display: '',
            link   : ''
        };
    }
}

export default EditableLink;
