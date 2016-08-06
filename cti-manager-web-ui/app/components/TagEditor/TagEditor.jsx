import React from 'react';
import {HotKeys} from 'react-hotkeys';
import _ from 'lodash';

import './TagEditor.scss';

export default class TagEditor extends React.Component {
    constructor(props) {
        super();
        this.state = {
            tags: props.tags.slice(),
            deletedTags: []
        };
    }

    fireSave() {
        const newTags = _.difference(this.state.tags.slice(), this.state.deletedTags);
        if (typeof this.props.onSave === 'function') {
            this.props.onSave(newTags);
        }
    }

    addTag(tag, callback) {
        const deletedIndex    = this.state.deletedTags.indexOf(tag),
              currentTagIndex = this.state.tags.indexOf(tag);

        let deletedTags = this.state.deletedTags.slice(),
            tags        = this.state.tags.slice();

        if (~deletedIndex) {
            deletedTags.splice(deletedIndex, 1);
        }

        if (currentTagIndex === -1) {
            tags.push(tag);
        }

        this.setState({deletedTags, tags}, () => {
            if (typeof callback === 'function') {
                callback();
            }
        });
    }

    addTagFromInput() {
        const newTag = this.refs.addTagInput.value;
        this.addTag(newTag, () => {
            this.refs.addTagInput.value = '';
        });
    }

    deleteTag(tag) {
        const currentTagIndex  = this.state.tags.indexOf(tag),
              originalTagIndex = this.props.tags.indexOf(tag);
        let deletedTags = this.state.deletedTags.slice(),
            tags        = this.state.tags.slice();
        if (~currentTagIndex) {
            if (originalTagIndex === -1) {
                tags.splice(currentTagIndex, 1);
            } else {
                deletedTags.push(tag);
            }
            this.setState({deletedTags, tags});
        }
    }

    componentDidMount() {
        this.refs.addTagInput.focus();
    }

    componentDidUpdate(prevProps, prevState) {
        this.refs.addTagInput.focus();
    }

    renderAddTagInput() {
        return (
            <HotKeys handlers={{enter: this.addTagFromInput.bind(this)}}>
                <div className="add-tag-section">
                    <input ref="addTagInput" type="text"/>
                    <button className="accent" onClick={this.addTagFromInput.bind(this)}>
                        <i className="material-icons">add</i>
                    </button>
                </div>
            </HotKeys>
        );
    }

    calculateTagClass(tag) {
        if (~this.state.deletedTags.indexOf(tag)) {
            return 'deleted';
        } else if (this.props.tags.indexOf(tag) === -1) {
            return 'added';
        } else {
            return '';
        }
    }

    renderTagButton(tag) {
        if (~this.state.deletedTags.indexOf(tag)) {
            return (
                <i className="material-icons" onClick={() => {this.addTag(tag)}}>undo</i>
            );
        }

        return (
            <i className="material-icons" onClick={() => {this.deleteTag(tag)}}>delete</i>
        );
    }

    renderTagList() {
        const tags = this.state.tags.slice();
        tags.sort((t1, t2) => {
            return t1 < t2 ? -1 : t1 > t2 ? 1 : 0;
        });

        const tagListItems = tags.map((tag) => {
            return (
                <li key={tag} className="tag-editor-list-item">
                    <span className={`tag ${this.calculateTagClass(tag)}`}>{tag}</span>
                    {this.renderTagButton(tag)}
                </li>
            );
        });

        return (
            <ul className="tag-editor-list">
                {tagListItems}
            </ul>
        );
    }

    render() {
        return (
            <div className="TagEditor">
                {this.renderAddTagInput()}
                {this.renderTagList()}
                <button className="save-button accent" onClick={this.fireSave.bind(this)}>Save</button>
            </div>
        );
    }
}
