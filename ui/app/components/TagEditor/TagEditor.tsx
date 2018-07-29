import * as _ from 'lodash';
import * as React from 'react';

import AutocompleteInput from '../AutocompleteInput/AutocompleteInput';

import TagActions from '../../actions/TagActions';
import TagService from '../../services/TagService';
import {TagStore, TagStoreState} from '../../stores/TagStore';

import {ReactElement, ReactNode} from 'react';
import {AbstractRefluxComponent} from '../AbstractComponent/AbstractComponent';
import './TagEditor.scss';

interface TagEditorProps {
    tags?: string[];
    onSave?: (tagIds: string[]) => void;
}

interface TagEditorState {
    tags?: string[];
    deletedTags?: string[];
    allTags?: string[];
}

class TagEditor extends AbstractRefluxComponent<TagEditorProps, TagEditorState> {
    public static defaultProps: TagEditorProps = {
        tags  : [],
        onSave: _.noop
    };

    private addTagInput: AutocompleteInput;

    constructor(props: TagEditorProps) {
        super(props);
        this.state = {
            tags       : props.tags.slice(),
            deletedTags: []
        };

        this.mapStoreToState(TagStore, (fromStore: TagStoreState) => {
            return {
                allTags: fromStore.tags.map(tag => TagService.toDisplayName(tag.id))
            };
        });

        TagActions.updateTags();
    }

    public fireSave(): void {
        const newTags = _.difference(this.state.tags.slice(), this.state.deletedTags);
        this.getProps().onSave(newTags.map(newTag => TagService.toTagId(newTag)));
    }

    public addTag(tag: string, callback?: () => void): void {
        tag = tag.trim();
        const deletedIndex    = this.state.deletedTags.indexOf(tag),
              currentTagIndex = this.state.tags.indexOf(tag);

        const deletedTags = this.state.deletedTags.slice(),
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

    public addTagAndClear(tag: string): void {
        this.addTag(tag, () => {
            this.addTagInput.value = '';
        });
    }

    public addTagFromInput(): void {
        const newTag = this.addTagInput.value;
        this.addTagAndClear(newTag);
    }

    public deleteTag(tag: string): void {
        const currentTagIndex  = this.state.tags.indexOf(tag),
              originalTagIndex = this.getProps().tags.indexOf(tag);
        const deletedTags = this.state.deletedTags.slice(),
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

    public componentDidMount(): void {
        this.addTagInput.focus();
    }

    public componentDidUpdate(): void {
        this.addTagInput.focus();
    }

    public renderAddTagInput(): ReactNode {
        return (
            <div className='add-tag-section'>
                <AutocompleteInput ref={input => this.addTagInput = input}
                                   items={this.state.allTags}
                                   onAutocomplete={this.addTagAndClear.bind(this)}
                                   onEnter={this.addTagFromInput.bind(this)}/>
                <button className='accent' onClick={this.addTagFromInput.bind(this)}>
                    <i className='material-icons'>add</i>
                </button>
            </div>
        );
    }

    public calculateTagClass(tag: string): string {
        if (~this.state.deletedTags.indexOf(tag)) {
            return 'deleted';
        } else if (this.getProps().tags.indexOf(tag) === -1) {
            return 'added';
        } else {
            return '';
        }
    }

    public renderTagButton(tag: string): ReactNode {
        if (~this.state.deletedTags.indexOf(tag)) {
            return (
                <i className='material-icons' onClick={() => this.addTag(tag)}>undo</i>
            );
        }

        return (
            <i className='material-icons' onClick={() => this.deleteTag(tag)}>delete</i>
        );
    }

    public renderTagList(): ReactNode {
        const tags = this.state.tags.slice();
        tags.sort((t1, t2) => {
            return t1 < t2 ? -1 : t1 > t2 ? 1 : 0;
        });

        const tagListItems = tags.map(tag => {
            return (
                <li key={tag} className='tag-editor-list-item'>
                    <span className={`tag ${this.calculateTagClass(tag)}`}>{TagService.toDisplayName(tag)}</span>
                    {this.renderTagButton(tag)}
                </li>
            );
        });

        return (
            <ul className='tag-editor-list'>
                {tagListItems}
            </ul>
        );
    }

    public render(): ReactElement<TagEditorProps> {
        return (
            <div className='TagEditor'>
                {this.renderAddTagInput()}
                {this.renderTagList()}
                <button className='save-button accent' onClick={this.fireSave.bind(this)}>Save</button>
            </div>
        );
    }

    protected getBaseProps(): TagEditorProps {
        return TagEditor.defaultProps;
    }
}

export default TagEditor;
