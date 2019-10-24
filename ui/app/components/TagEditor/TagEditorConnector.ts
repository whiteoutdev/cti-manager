import {Dispatch} from 'redux';
import {AppState} from '../../redux/AppState';
import {connectWithLifecycle} from '../../redux/connectWithLifecycle';
import {LifecycleProps} from '../../redux/LifecycleComponent';
import {UpdateTagsAction} from '../../redux/tag/TagActions';
import TagEditor, {TagEditorProps} from './TagEditor';

export interface TagEditorConnectorProps {
    tags?: string[];
    onSave?: (tags: string[]) => void;
}

function mapStateToProps(state: AppState, ownProps: TagEditorConnectorProps): Partial<TagEditorProps> {
    return {
        tagPool: state.tag.tags.map(tag => tag.id),
        ...ownProps
    };
}

function mapDispatchToProps(dispatch: Dispatch, ownProps: TagEditorConnectorProps): Partial<TagEditorProps & LifecycleProps> {
    return {
        componentDidMount(): void {
            dispatch(new UpdateTagsAction());
        }
    };
}

export const TagEditorConnector = connectWithLifecycle(
    mapStateToProps,
    mapDispatchToProps
)(TagEditor);
