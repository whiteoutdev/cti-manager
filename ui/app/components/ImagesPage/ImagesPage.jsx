import React from 'react';
import PropTypes from 'prop-types';

import NavbarredPage from '../NavbarredPage/NavbarredPage.jsx';
import ImageSidebar from '../ImageSidebar/ImageSidebar.jsx';
import Gallery from './ImagesPageThumbnailGallery.jsx';

import appConfig from '../../config/app.config';
import UrlService from '../../services/UrlService';
import MediaApi from '../../api/MediaApi';

import './ImagesPage.scss';

const defaultLimit = appConfig.images.defaultPageLimit;

class ImagesPage extends React.Component {
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

    runQueryFromProps(location) {
        const search = UrlService.parseQueryString(location.search),
              skip   = Number(search.skip) || 0,
              limit  = Number(search.limit) || defaultLimit;

        let tags = null;

        if (search.tags) {
            tags = search.tags.split(',').map(tag => tag.toLowerCase());
        }

        MediaApi.findMedia(tags, skip, limit).then((data) => {
            const images       = data.media,
                  thumbnailIds = data.media.map(file => file.id),
                  count        = data.count;
            this.setState({images, thumbnailIds, skip, limit, count});
        });
    }

    componentDidMount() {
        this.runQueryFromProps(this.props.location);
    }

    componentWillReceiveProps(nextProps) {
        this.runQueryFromProps(nextProps.location);
    }

    render() {
        return (
            <div className="ImagesPage">
                <NavbarredPage>
                    <ImageSidebar images={this.state.images} tagLimit={30}
                                  onUploadComplete={() => {this.runQueryFromProps(this.props.location)}}/>
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

ImagesPage.propTypes = {
    location: PropTypes.object
};

ImagesPage.defaultProps = {
    location: {query: {}, search: ''}
};

export default ImagesPage;
