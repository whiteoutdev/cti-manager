import React from 'react';

import NavbarredPage from '../NavbarredPage/NavbarredPage.jsx';
import ImageSidebar from '../ImageSidebar/ImageSidebar.jsx';
import Gallery from './ImagesPageThumbnailGallery.jsx';

import appConfig from '../../config/app.config';
import history from '../../services/history';
import ImagesApi from '../../api/ImagesApi';

import './ImagesPage.scss';

const defaultLimit = appConfig.images.defaultPageLimit;

export default class ImagesPage extends React.Component {
    constructor() {
        super();
        this.state = {
            images: [],
            thumbnailIds: null,
            skip: 0,
            limit: defaultLimit,
            count: 0
        };
    }

    runQueryFromProps(query) {
        const tags  = query.tags ? query.tags.split(',') : null,
              skip  = Number(query.skip) || 0,
              limit = Number(query.limit) || defaultLimit;
        ImagesApi.getImages(tags, skip, limit).then((data) => {
            const images       = data.images,
                  thumbnailIds = data.images.map(image => image._id),
                  count        = data.count;
            this.setState({images, thumbnailIds, skip, limit, count});
        });
    }

    handleSearch(tags) {
        history.push(`/images?tags=${tags.join()}&limit=${defaultLimit}`);
    }

    componentDidMount() {
        this.runQueryFromProps(this.props.location.query);
    }

    componentWillReceiveProps(nextProps) {
        this.runQueryFromProps(nextProps.location.query);
    }

    render() {
        return (
            <div className="ImagesPage">
                <NavbarredPage>
                    <ImageSidebar images={this.state.images} onSearch={this.handleSearch.bind(this)}/>
                    <Gallery ids={this.state.thumbnailIds}
                             skip={this.state.skip}
                             limit={this.state.limit}
                             count={this.state.count}/>
                </NavbarredPage>
            </div>
        );
    }
};
