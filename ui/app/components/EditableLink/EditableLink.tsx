import * as _ from 'lodash';
import * as React from 'react';

import {ReactElement, ReactNode} from 'react';
import {AbstractComponent} from '../AbstractComponent/AbstractComponent';
import Hotkeys from '../Hotkeys/Hotkeys';
import './EditableLink.scss';

interface EditableLinkProps {
    onSave: (value: string) => void;
    display: string;
    link: string;
}

interface EditableLinkState {
    editMode: boolean;
}

class EditableLink extends AbstractComponent<EditableLinkProps, EditableLinkState> {
    public static defaultProps: EditableLinkProps = {
        onSave : _.noop,
        display: '',
        link   : ''
    };

    private editableInput: HTMLInputElement;

    constructor(props: EditableLinkProps) {
        super(props);
        this.state = {
            editMode: false
        };
    }

    public toggleEditMode(): Promise<void> {
        return new Promise(resolve => {
            this.setState({
                editMode: !this.state.editMode
            }, () => {
                resolve();
            });
        });
    }

    public fireSave(): Promise<void> {
        const newValue = this.editableInput.value;
        return this.toggleEditMode()
            .then(() => {
                this.getProps().onSave(newValue);
            });
    }

    public componentDidUpdate(): void {
        if (this.state.editMode) {
            this.editableInput.select();
        }
    }

    public renderEditor(): ReactNode {
        return (
            <Hotkeys className='link-form' handlers={{enter: this.fireSave.bind(this)}}>
                <input type='text'
                       className='link-input with-addon'
                       ref={input => this.editableInput = input}
                       defaultValue={this.getProps().display}
                       onBlur={this.toggleEditMode.bind(this)}/>
                <button className='accent' onClick={this.fireSave.bind(this)}>
                    <i className='material-icons'>done</i>
                </button>
            </Hotkeys>
        );
    }

    public renderLink(): ReactNode {
        if (this.getProps().link && this.getProps().display) {
            return (
                <div className='link-display'>
                    <a href={this.getProps().link}>{this.getProps().display}</a>
                    <i className='material-icons edit-button' onClick={this.toggleEditMode.bind(this)}>edit</i>
                </div>
            );
        } else {
            return (
                <div className='link-display'>
                    <span>None</span>
                    <i className='material-icons edit-button' onClick={this.toggleEditMode.bind(this)}>edit</i>
                </div>
            );
        }
    }

    public renderContent(): ReactNode {
        if (this.state.editMode) {
            return this.renderEditor();
        } else {
            return this.renderLink();
        }
    }

    public render(): ReactElement<EditableLinkProps> {
        return (
            <div className='EditableLink'>
                {this.renderContent()}
            </div>
        );
    }

    protected getBaseProps(): EditableLinkProps {
        return EditableLink.defaultProps;
    }
}

export default EditableLink;
