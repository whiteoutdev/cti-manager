import React from 'react';

import RefluxComponent from '../RefluxComponent/RefluxComponent';
import NavbarredPage from '../NavbarredPage/NavbarredPage.jsx';
import TagsSidebar from '../TagsSidebar/TagsSidebar.jsx';
import AutocompleteInput from '../AutocompleteInput/AutocompleteInput.jsx';

import TagsApi from '../../api/TagsApi';
import TagService from '../../services/TagService';
import TagActions from '../../actions/TagActions';
import TagStore from '../../stores/TagStore';
import TagTypeStore from '../../stores/TagTypeStore';

import './TagsPage.scss';

export default class TagsPage extends RefluxComponent {
    constructor(props) {
        super();
        this.state = {
            tag: null
        };
        this.listenTo(TagTypeStore, this.onTagTypesChange, (tagTypes) => {
            this.state.tagTypes = tagTypes;
        });
        this.listenTo(TagStore, this.onTagsChange, (data) => {
            this.state.allTags = data.tags;
            this.state.tagIndex = data.tagIndex
        });
    }

    onTagTypesChange(tagTypes) {
        this.setState({tagTypes});
    }

    onTagsChange(allTags, tagIndex) {
        this.setState({allTags, tagIndex});
    }

    onTagSelect(tag) {
        this.setState({
            originalTag: tag,
            tag        : JSON.parse(JSON.stringify(tag))
        });
    }

    componentDidMount() {
        TagActions.updateTagTypes();
        if (this.props.routeParams.tagID) {
            this.loadTag(this.props.routeParams.tagID);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.routeParams.tagID !== this.props.routeParams.tagID) {
            this.loadTag(nextProps.routeParams.tagID);
        }
    }

    loadTag(tagId) {
        TagsApi.getTag(tagId).then((tag) => {
            this.setState({tag});
        });
    }

    setTagType(tagType) {
        const tag = this.state.tag;
        tag.type = tagType;
        TagsApi.updateTag(tag.id, tag);
    }

    addDerivedTagAndClear(derivedTag) {
        const tag = this.state.tag;
        if (!~tag.derivedTags.indexOf(derivedTag)) {
            tag.derivedTags.push(derivedTag);
        }
        this.refs.tagInput.value = '';
        TagsApi.updateTag(tag.id, tag);
    }

    addDerivedTagFromInput() {
        const derivedTag = this.refs.tagInput.value;
        this.addDerivedTagAndClear(derivedTag);
    }

    removeDerivedTag(derivedTagId) {
        const tag   = this.state.tag,
              index = this.state.tag.derivedTags.indexOf(derivedTagId);
        if (~index) {
            tag.derivedTags.splice(index, 1);
            TagsApi.updateTag(tag.id, tag);
        }
    }

    renderTagNameSection(tag) {
        return (
            <div className="tag-fact">
                <div className="left-col">
                    <h2>Tag Name:</h2>
                </div>
                <div className="right-col">
                    <h2>{TagService.toDisplayName(tag.id)}</h2>
                </div>
            </div>
        );
    }

    renderTagTypeSection(tag) {
        const tagTypeList = this.state.tagTypes.map((tagType) => {
            const className = `tag-type-button ${tagType} ${tagType === tag.type ? 'selected' : ''}`;
            return (
                <li key={tagType} className="tag-type">
                    <button className={className} onClick={() => {this.setTagType(tagType)}}>
                        {tagType}
                    </button>
                </li>
            );
        });

        return (
            <div className="tag-fact">
                <div className="left-col">
                    Tag Type:
                </div>
                <div className="right-col">
                    <ul className="tag-type-list">
                        {tagTypeList}
                    </ul>
                </div>
            </div>
        );
    }

    renderDerivedTagsSection(tag) {
        const derivedTagList = tag.derivedTags.map((derivedTagId) => {
            const derivedTag     = this.state.tagIndex[derivedTagId],
                  derivedTagType = derivedTag ? derivedTag.type : '';

            return (
                <li key={derivedTagId} className={`derived-tag ${derivedTagType}`}>
                    <span>{TagService.toDisplayName(derivedTagId)}</span>
                    <i className="delete-icon material-icons" onClick={() => {this.removeDerivedTag(derivedTagId)}}>
                        delete
                    </i>
                </li>
            );
        });

        return (
            <div className="tag-fact derived-tags-section">
                <div className="left-col">
                    Derived tags:
                </div>
                <div className="right-col">
                    <div className="tag-search-section">
                        <AutocompleteInput ref="tagInput"
                                           items={this.state.allTags.map(tag => tag.id)}
                                           onAutocomplete={this.addDerivedTagAndClear.bind(this)}
                                           onEnter={this.addDerivedTagFromInput.bind(this)}/>
                        <button className="accent">
                            <i className="material-icons">add</i>
                        </button>
                    </div>
                    <ul className="derived-tag-list">
                        {derivedTagList}
                    </ul>
                </div>
            </div>
        );
    }

    renderTagDetails() {
        const tag = this.state.tag;
        if (!tag) {
            return null;
        }

        return (
            <div className="tag-details-section">
                <div className="tag-details-card">
                    {this.renderTagNameSection(tag)}
                    {this.renderTagTypeSection(tag)}
                    {this.renderDerivedTagsSection(tag)}
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className="TagsPage">
                <NavbarredPage>
                    <TagsSidebar onTagSelect={this.onTagSelect.bind(this)}/>
                    {this.renderTagDetails()}
                </NavbarredPage>
            </div>
        );
    }
}
