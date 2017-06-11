import React from 'react';
import _ from 'lodash';
import {HotKeys} from 'react-hotkeys';
import PropTypes from 'prop-types';

import './EditableLink.scss';

class EditableLink extends React.Component {
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
        const newValue = this.refs.editableInput.value;
        this.toggleEditMode().then(() => {
            this.props.onSave(newValue);
        });
    }

    componentDidUpdate() {
        if (this.state.editMode) {
            this.refs.editableInput.select();
        }
    }

    renderEditor() {
        return (
            <HotKeys className="link-form" handlers={{enter: this.fireSave.bind(this)}}>
                <input type="text"
                       className="link-input with-addon"
                       ref="editableInput"
                       defaultValue={this.props.display}
                       onBlur={this.toggleEditMode.bind(this)}/>
                <button className="accent" onClick={this.fireSave.bind(this)}>
                    <i className="material-icons">done</i>
                </button>
            </HotKeys>
        );
    }

    renderLink() {
        if (this.props.link && this.props.display) {
            return (
                <div className="link-display">
                    <a href={this.props.link}>{this.props.display}</a>
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
}

EditableLink.propTypes = {
    onSave : PropTypes.func,
    display: PropTypes.string,
    link   : PropTypes.string
};

EditableLink.defaultProps = {
    onSave : _.noop,
    display: '',
    link   : ''
};

export default EditableLink;
