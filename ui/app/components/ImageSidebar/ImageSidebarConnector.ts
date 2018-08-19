import {Dispatch} from 'redux';
import {AppState} from '../../redux/AppState';
import {connectWithLifecycle} from '../../redux/connectWithLifecycle';
import {LifecycleProps} from '../../redux/LifecycleComponent';
import {UpdateTagsAction, UpdateTagTypesAction} from '../../redux/tag/TagActions';
import {UploadImagesAction} from '../../redux/upload/UploadActions';
import ImageSidebar, {ImageSidebarProps} from './ImageSidebar';

export interface ImageSidebarConnectorProps {
    tagsEditable?: boolean;
    tagList: string[];
    tagLimit?: number;
    uploadDisabled?: boolean;
    onTagsChange?: (tags: string[]) => void;
    onSearch?: (tags: string[]) => void;
    onUploadComplete?: () => void;
}

function mapStateToProps(state: AppState, ownProps: ImageSidebarConnectorProps): Partial<ImageSidebarProps> {
    return {
        ...state.upload,
        ...state.tag,
        ...state.media,
        tagsEditable  : ownProps.tagsEditable,
        tagList       : ownProps.tagList,
        tagLimit      : ownProps.tagLimit,
        uploadDisabled: ownProps.uploadDisabled
    };
}

function mapDispatchToProps(dispatch: Dispatch, ownProps: ImageSidebarConnectorProps): Partial<ImageSidebarProps & LifecycleProps> {
    return {
        componentDidMount(): void {
            dispatch(new UpdateTagTypesAction());
            dispatch(new UpdateTagsAction());
        },
        componentDidUpdate(prevProps: ImageSidebarProps): void {
            if (prevProps.uploadPending && !this.props.uploadPending) {
                ownProps.onUploadComplete && ownProps.onUploadComplete();
            }
        },
        onTagsChange(tags: string[]): void {
            ownProps.onTagsChange && ownProps.onTagsChange(tags);
        },
        onUpload(files: FileList): void {
            dispatch(new UploadImagesAction(files));
        },
        onSearch(tags: string[]): void {
            ownProps.onSearch && ownProps.onSearch(tags);
        }
    };
}

export const ImageSidebarConnector = connectWithLifecycle(
    mapStateToProps,
    mapDispatchToProps
)(ImageSidebar);
