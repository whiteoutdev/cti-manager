import React from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';

import appConfig from '../../config/app.config';

import './ImagesPageThumbnailGallery.scss';

const maxNavButtons = 11;

class ImagesPageThumbnailGallery extends React.Component {
    shouldComponentUpdate(nextProps) {
        return JSON.stringify(nextProps) !== JSON.stringify(this.props);
    }

    renderThumbnails() {
        if (this.props.ids) {
            return this.props.ids.map((id) => {
                return (
                    <li key={id} className="thumbnail-list-item">
                        <Link to={`/media/${id}`}>
                            <img src={`${appConfig.api.path}/media/${id}/thumbnail/download`} alt={id}/>
                        </Link>
                    </li>
                );
            });
        }
    }

    renderNavigation() {
        const imageCount = this.props.count,
              limit      = this.props.limit,
              skip       = this.props.skip,
              query      = this.props.query,
              pageCount  = Math.ceil(imageCount / limit);

        if (!pageCount) {
            return null;
        }

        const currentPage = Math.floor(skip / limit);
        let minPageNav = Math.max(currentPage - (maxNavButtons - 1) / 2, 0);
        const maxPageNav = Math.min(minPageNav + maxNavButtons, pageCount),
              navButtons = [];

        if (maxPageNav === pageCount) {
            minPageNav = Math.max(maxPageNav - maxNavButtons, 0);
        }

        for (let i = minPageNav; i < maxPageNav; i++) {
            if (i === currentPage) {
                navButtons.push(
                    <li className="nav-button current" key={i}><span>{i + 1}</span></li>
                );
            } else {
                const newSkip = i * limit;
                let url = `/media?${query ? `${query}&` : ''}skip=${newSkip}&limit=${limit}`;
                navButtons.push(
                    <li key={i} className="nav-button link">
                        <Link to={url}>{i + 1}</Link>
                    </li>
                );
            }
        }

        if (currentPage > 0) {
            const previousPageUrl = `/media?${query ? `${query}&` : ''}skip=${(currentPage - 1) *
                                                                              limit}&limit=${limit}`;
            navButtons.unshift(
                <li key="firstPage" className="nav-button link button-link">
                    <Link to={`/media?${query ? `${query}&` : ''}limit=${limit}`}>
                        <i className="material-icons">first_page</i>
                    </Link>
                </li>,
                <li key="previousPage" className="nav-button link button-link">
                    <Link to={previousPageUrl}>
                        <i className="material-icons">chevron_left</i>
                    </Link>
                </li>
            );
        }

        if (currentPage < pageCount - 1) {
            const nextPageUrl = `/media?${query ? `${query}&` : ''}skip=${(currentPage + 1) * limit}&limit=${limit}`;
            navButtons.push(
                <li key="nextPage" className="nav-button link button-link">
                    <Link to={nextPageUrl}>
                        <i className="material-icons">chevron_right</i>
                    </Link>
                </li>,
                <li key="lastPage" className="nav-button link button-link">
                    <Link to={`/media?${query ? `${query}&` : ''}skip=${(pageCount - 1) * limit}&limit=${limit}`}>
                        <i className="material-icons">last_page</i>
                    </Link>
                </li>
            );
        }

        return (
            <ul className="nav-buttons">
                {navButtons}
            </ul>
        );
    }

    render() {
        return (
            <div className="ImagesPageThumbnailGallery">
                <ul className="thumbnail-list">
                    {this.renderThumbnails()}
                    <li className="end-padding"/>
                </ul>
                <div className="page-navigation">
                    {this.renderNavigation()}
                </div>
            </div>
        );
    }
}

ImagesPageThumbnailGallery.propTypes = {
    ids  : PropTypes.arrayOf(PropTypes.string),
    count: PropTypes.number,
    limit: PropTypes.number,
    skip : PropTypes.number,
    query: PropTypes.string
};

ImagesPageThumbnailGallery.defaultProps = {
    ids  : [],
    count: 0,
    limit: 40,
    skip : 0,
    query: ''
};

export default ImagesPageThumbnailGallery;
