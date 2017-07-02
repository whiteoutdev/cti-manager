import React from 'react';
import Reflux from 'reflux';
import _ from 'lodash';
import PropTypes from 'prop-types';

import AutocompleteInput from '../AutocompleteInput/AutocompleteInput.jsx';

import TagService from '../../services/TagService';
import TagStore from '../../stores/TagStore';
import TagActions from '../../actions/TagActions';

import './TagEditor.scss';

class TagEditor extends Reflux.Component {
    constructor(props) {
        super();
        this.state = {
            tags       : props.tags.slice(),
            deletedTags: []
        };

        this.mapStoreToState(TagStore, (fromStore) => {
            return {
                allTags: fromStore.tags.map(tag => TagService.toDisplayName(tag.id))
            };
        });

        TagActions.updateTags();
    }

    fireSave() {
        const newTags = _.difference(this.state.tags.slice(), this.state.deletedTags);
        this.props.onSave(newTags.map(newTag => TagService.toTagId(newTag)));
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
            this.addTagInput.value = '';
        });
    }

    addTagFromInput() {
        const newTag = this.addTagInput.value;
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
        this.addTagInput.focus();
    }

    componentDidUpdate() {
        this.addTagInput.focus();
    }

    renderAddTagInput() {
        return (
            <div className="add-tag-section">
                <AutocompleteInput ref={input => this.addTagInput = input}
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
                <i className="material-icons" onClick={() => this.addTag(tag)}>undo</i>
            );
        }

        return (
            <i className="material-icons" onClick={() => this.deleteTag(tag)}>delete</i>
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
                    <span className={`tag ${this.calculateTagClass(tag)}`}>{TagService.toDisplayName(tag)}</span>
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

TagEditor.propTypes = {
    tags  : PropTypes.arrayOf(PropTypes.string),
    onSave: PropTypes.func
};

TagEditor.defaultProps = {
    tags  : [],
    onSave: _.noop
};

export default TagEditor;
