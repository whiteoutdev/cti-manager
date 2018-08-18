import {isEqual, pick} from 'lodash';
import {RouteComponentProps} from 'react-router';
import {Dispatch} from 'redux';
import {LinkInformation} from '../../components/Pagination/Pagination';
import appConfig from '../../config/app.config';
import {AppState} from '../../redux/AppState';
import {connectWithLifecycle} from '../../redux/connectWithLifecycle';
import {FetchImagesAction} from '../../redux/imagesPage/ImagesPageActions';
import {LifecycleProps} from '../../redux/LifecycleComponent';
import UrlService from '../../services/UrlService';
import {ImagesPage, ImagesPageProps} from './ImagesPage';

function mapStateToProps(state: AppState, ownProps: RouteComponentProps<{}>): Partial<ImagesPageProps> {
    return {
        ...state.imagesPage,
        ...getSearchProps(ownProps)
    };
}

function mapDispatchToProps(dispatch: Dispatch, ownProps: RouteComponentProps<{}>): Partial<ImagesPageProps & LifecycleProps> {
    return {
        componentDidMount(): void {
            dispatchQuery(dispatch, ownProps);
        },
        componentDidUpdate(prevProps: RouteComponentProps<{}>): void {
            if (isEqual(pick(ownProps, 'location', 'match'), pick(prevProps, 'location', 'match'))) {
                return;
            }

            dispatchQuery(dispatch, ownProps);
        },
        onSidebarUploadComplete(): void {
            dispatchQuery(dispatch, ownProps);
        }
    };
}

function getSearchProps(ownProps: RouteComponentProps<{}>): Partial<ImagesPageProps> {
    const search = UrlService.parseQueryString(ownProps.location.search),
          skip   = Number(search.skip) || 0,
          limit  = Number(search.limit) || appConfig.images.defaultPageLimit;

    let tags = null;

    if (search.tags) {
        tags = (search.tags as string)
            .split(',')
            .map(tag => tag.toLowerCase());
    }

    const match       = ownProps.location.search.match(/tags=([^&]+)/),
          tagsQuery   = match ? match[0] : '',
          linkFactory = (info: LinkInformation) => `/media?${tagsQuery ? `${tagsQuery}&` : ''}skip=${info.next * limit}&limit=${limit}`;

    return {skip, limit, tags, tagsQuery, linkFactory};
}

function dispatchQuery(dispatch: Dispatch, ownProps: RouteComponentProps<{}>): void {
    const {tags, skip, limit} = getSearchProps(ownProps);
    dispatch(new FetchImagesAction(tags, skip, limit));
}

export const ImagesPageConnector = connectWithLifecycle(
    mapStateToProps,
    mapDispatchToProps
)(ImagesPage);
