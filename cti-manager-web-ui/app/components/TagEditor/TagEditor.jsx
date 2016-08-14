import React from 'react';
import _ from 'lodash';

import RefluxComponent from '../RefluxComponent/RefluxComponent';
import AutocompleteInput from '../AutocompleteInput/AutocompleteInput.jsx';

import TagStore from '../../stores/TagStore';
import TagActions from '../../actions/TagActions';

import './TagEditor.scss';

export default class TagEditor extends RefluxComponent {
    constructor(props) {
        super();
        this.state = {
            tags       : props.tags.slice(),
            deletedTags: [],
            allTags    : []
        };
        this.listenTo(TagStore, this.updateTags, (tags) => {
            this.state.allTags = tags.map(tag => tag.id.replace(/_/g, ' '));
        });
        TagActions.updateTags();
    }

    updateTags(tags) {
        this.setState({
            allTags: tags.map(tag => tag.id.replace(/_/g, ' '))
        });
    }

    fireSave() {
        const newTags = _.difference(this.state.tags.slice(), this.state.deletedTags);
        if (typeof this.props.onSave === 'function') {
            this.props.onSave(newTags);
        }
    }

    addTag(tag, callback) {
        tag = tag.trim();
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

    addTagAndClear(tag) {
        this.addTag(tag, () => {
            this.refs.addTagInput.value = '';
        });
    }

    addTagFromInput() {
        const newTag = this.refs.addTagInput.value;
        this.addTagAndClear(newTag);
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

    componentDidUpdate() {
        this.refs.addTagInput.focus();
    }

    renderAddTagInput() {
        return (
            <div className="add-tag-section">
                <AutocompleteInput ref="addTagInput"
                                   items={this.state.allTags}
                                   onAutocomplete={this.addTagAndClear.bind(this)}
                                   onEnter={this.addTagFromInput.bind(this)}/>
                <button className="accent" onClick={this.addTagFromInput.bind(this)}>
                    <i className="material-icons">add</i>
                </button>
            </div>
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
