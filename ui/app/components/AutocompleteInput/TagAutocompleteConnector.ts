import {HTMLProps} from 'react';
import {Dispatch} from 'redux';
import {AppState} from '../../redux/AppState';
import {connectWithLifecycle} from '../../redux/connectWithLifecycle';
import {LifecycleProps} from '../../redux/LifecycleComponent';
import {UpdateTagsAction} from '../../redux/tag/TagActions';
import {AutocompleteInput, AutocompleteInputProps} from './AutocompleteInput';

export interface TagAutocompleteConnectorProps extends HTMLProps<HTMLInputElement> {
    tokenize?: boolean;
    limit?: number;
    onAutocomplete?: (tag: string) => void;
    onEnter?: (tag: string) => void;
}

function mapStateToProps(state: AppState, ownProps: TagAutocompleteConnectorProps): Partial<AutocompleteInputProps> {
    return {
        ...this.props,
        items: state.tag.tags.map(tag => tag.id)
    };
}

function mapDispatchToProps(dispatch: Dispatch, ownProps: TagAutocompleteConnectorProps): Partial<AutocompleteInputProps & LifecycleProps> {
    return {
        componentDidMount(): void {
            dispatch(new UpdateTagsAction());
        }
    };
}

export const TagAutocompleteConnector = connectWithLifecycle(
    mapStateToProps,
    mapDispatchToProps,
    null,
    {withRef: true}
)(AutocompleteInput);
