import * as React from 'react';

import NavbarredPage from '../NavbarredPage/NavbarredPage';
import ImageSidebar from '../ImageSidebar/ImageSidebar';
import Gallery from './ImagesPageThumbnailGallery';

import appConfig from '../../config/app.config';
import UrlService from '../../services/UrlService';
import MediaApi from '../../api/MediaApi';

import './ImagesPage.scss';
import {RouteComponentProps} from 'react-router';
import Media from '../../model/media/Media';
import {Location} from 'history';

const defaultLimit = appConfig.images.defaultPageLimit;

interface ImagesPageState {
    images: Media[];
    thumbnailIds: string[];
    skip: number;
    limit: number;
    count: number;
}

class ImagesPage extends React.Component<RouteComponentProps<{}>, ImagesPageState> {
    constructor() {
        super();
        this.state = {
            images      : [],
            thumbnailIds: null,
            skip        : 0,
            limit       : defaultLimit,
            count       : 0
        };
    }

    getTagsQuery() {
        const match = this.props.location.search.match(/tags=([^&]+)/);
        return match ? match[0] : '';
    }

    runQueryFromProps(location?: Location) {
        location = location || this.props.location;

        const search = UrlService.parseQueryString(location.search),
              skip   = Number(search.skip) || 0,
              limit  = Number(search.limit) || defaultLimit;

        let tags = null;

        if (search.tags) {
            tags = (search.tags as string)
                .split(',')
                .map(tag => tag.toLowerCase());
        }

        MediaApi.findMedia(tags, skip, limit)
            .then((data) => {
                const images       = data.media,
                      thumbnailIds = data.media.map(file => file.id),
                      count        = data.count;
                this.setState({images, thumbnailIds, skip, limit, count});
            });
    }

    componentDidMount() {
        this.runQueryFromProps(this.props.location);
    }

    componentWillReceiveProps(nextProps: RouteComponentProps<{}>) {
        this.runQueryFromProps(nextProps.location);
    }

    render() {
        return (
            <div className="ImagesPage">
                <NavbarredPage>
                    <ImageSidebar images={this.state.images} tagLimit={30}
                                  onUploadComplete={() => this.runQueryFromProps()}/>
                    <Gallery ids={this.state.thumbnailIds}
                             skip={this.state.skip}
                             limit={this.state.limit}
                             count={this.state.count}
                             query={this.getTagsQuery()}/>
                </NavbarredPage>
            </div>
        );
    }
}

export default ImagesPage;
