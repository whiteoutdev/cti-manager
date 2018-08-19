import {RouteComponentProps} from 'react-router';
import {Dispatch} from 'redux';
import {AppState} from '../../redux/AppState';
import {connectWithLifecycle} from '../../redux/connectWithLifecycle';
import {FetchImageAction, UpdateImageTagsAction} from '../../redux/imagePage/ImagePageActions';
import {LifecycleProps} from '../../redux/LifecycleComponent';
import ImagePage, {ImagePageProps} from './ImagePage';

export interface ImagePageRouteParams {
    imageID: string;
}

export interface ImagePageConnectorProps extends RouteComponentProps<ImagePageRouteParams> {
}

function mapStateToProps(state: AppState, ownProps: ImagePageConnectorProps): Partial<ImagePageProps> {
    return {...state.imagePage};
}

function mapDispatchToProps(dispatch: Dispatch, ownProps: ImagePageConnectorProps): Partial<ImagePageProps & LifecycleProps> {
    return {
        componentDidMount(): void {
            dispatchQuery(dispatch, ownProps);
        },
        componentDidUpdate(prevProps: ImagePageConnectorProps & ImagePageProps): void {
            if (this.props.match.params.imageID !== prevProps.match.params.imageID) {
                dispatchQuery(dispatch, this.props);
            }
        },
        onTagsChange(tags: string[]): void {
            dispatch(new UpdateImageTagsAction(ownProps.match.params.imageID, tags));
        }
    };
}

function dispatchQuery(dispatch: Dispatch, ownProps: ImagePageConnectorProps): void {
    dispatch(new FetchImageAction(ownProps.match.params.imageID));
}

export const ImagePageConnector = connectWithLifecycle(
    mapStateToProps,
    mapDispatchToProps
)(ImagePage);
