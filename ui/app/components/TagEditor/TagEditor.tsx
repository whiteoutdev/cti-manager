import {difference, noop} from 'lodash';
import * as React from 'react';
import {Component, ReactElement, ReactNode} from 'react';
import TagService from '../../services/TagService';
import {extractConnected} from '../../utils/redux-utils';
import AutocompleteInput from '../AutocompleteInput/AutocompleteInput';
import {TagAutocompleteConnector} from '../AutocompleteInput/TagAutocompleteConnector';
import './TagEditor.scss';

export interface TagEditorProps {
    tagPool: string[];
    tags?: string[];
    onSave?: (tagIds: string[]) => void;
}

export interface TagEditorState {
    tags?: string[];
    deletedTags?: string[];
}

export class TagEditor extends Component<TagEditorProps, TagEditorState> {
    public static defaultProps: TagEditorProps = {
        tagPool: [],
        tags   : [],
        onSave : noop
    };

    private addTagInput: AutocompleteInput;

    constructor(props: TagEditorProps) {
        super(props);
        this.state = {
            tags       : props.tags.slice(),
            deletedTags: []
        };
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

    public fireSave(): void {
        const newTags = difference(this.state.tags.slice(), this.state.deletedTags);
        this.props.onSave(newTags.map(newTag => TagService.toTagId(newTag)));
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
              originalTagIndex = this.props.tags.indexOf(tag);
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
        this.addTagInput && this.addTagInput.focus();
    }

    public componentDidUpdate(): void {
        this.addTagInput && this.addTagInput.focus();
    }

    public renderAddTagInput(): ReactNode {
        return (
            <div className='add-tag-section'>
                <TagAutocompleteConnector
                    ref={connector => this.addTagInput = extractConnected(connector)}
                    items={this.props.tagPool}
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
        } else if (this.props.tags.indexOf(tag) === -1) {
            return 'added';
        } else {
            return '';
        }
    }

    public renderTagButton(tag: string): ReactNode {
        let callback = () => this.deleteTag(tag),
            icon     = 'delete';
        if (~this.state.deletedTags.indexOf(tag)) {
            callback = () => this.addTag(tag);
            icon = 'undo';
        }

        return (
            <i className='material-icons' onClick={callback}>{icon}</i>
        );
    }

    public renderTagList(): ReactNode {
        const tags = this.state.tags.slice();
        tags.sort((t1, t2) => {
            return t1 < t2 ? -1 : t1 > t2 ? 1 : 0;
        });

        const tagListItems = tags.map(tag => (
            <li key={tag} className='tag-editor-list-item'>
                <span className={`tag ${this.calculateTagClass(tag)}`}>{TagService.toDisplayName(tag)}</span>
                {this.renderTagButton(tag)}
            </li>
        ));

        return (
            <ul className='tag-editor-list'>
                {tagListItems}
            </ul>
        );
    }
}

export default TagEditor;
