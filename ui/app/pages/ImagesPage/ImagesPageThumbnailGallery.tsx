import * as React from 'react';
import {Link} from 'react-router-dom';

import appConfig from '../../config/app.config';

import {ReactElement, ReactNode} from 'react';
import {AbstractComponent} from '../../components/AbstractComponent/AbstractComponent';
import './ImagesPageThumbnailGallery.scss';

const maxNavButtons = 11;

interface ImagesPageThumbnailGalleryProps {
    ids: string[];
    count: number;
    limit: number;
    skip: number;
    query: string;
}

class ImagesPageThumbnailGallery extends AbstractComponent<ImagesPageThumbnailGalleryProps, {}> {
    public static defaultProps: ImagesPageThumbnailGalleryProps = {
        ids  : [],
        count: 0,
        limit: 40,
        skip : 0,
        query: ''
    };

    public shouldComponentUpdate(nextProps: ImagesPageThumbnailGalleryProps): boolean {
        return JSON.stringify(nextProps) !== JSON.stringify(this.props);
    }

    public renderThumbnails(): ReactNode {
        if (this.getProps().ids) {
            return this.getProps().ids.map(id => {
                return (
                    <li key={id} className='thumbnail-list-item'>
                        <Link to={`/media/${id}`}>
                            <img src={`${appConfig.api.path}/media/${id}/thumbnail/download`} alt={id}/>
                        </Link>
                    </li>
                );
            });
        }
    }

    public renderNavigation(): ReactNode {
        const imageCount = this.getProps().count,
              limit      = this.getProps().limit,
              skip       = this.getProps().skip,
              query      = this.getProps().query,
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
                    <li className='nav-button current' key={i}><span>{i + 1}</span></li>
                );
            } else {
                const newSkip = i * limit;
                const url = `/media?${query ? `${query}&` : ''}skip=${newSkip}&limit=${limit}`;
                navButtons.push(
                    <li key={i} className='nav-button link'>
                        <Link to={url}>{i + 1}</Link>
                    </li>
                );
            }
        }

        if (currentPage > 0) {
            const previousPageUrl = `/media?${query ? `${query}&` : ''}skip=${(currentPage - 1) *
            limit}&limit=${limit}`;
            navButtons.unshift(
                <li key='firstPage' className='nav-button link button-link'>
                    <Link to={`/media?${query ? `${query}&` : ''}limit=${limit}`}>
                        <i className='material-icons'>first_page</i>
                    </Link>
                </li>,
                <li key='previousPage' className='nav-button link button-link'>
                    <Link to={previousPageUrl}>
                        <i className='material-icons'>chevron_left</i>
                    </Link>
                </li>
            );
        }

        if (currentPage < pageCount - 1) {
            const nextPageUrl = `/media?${query ? `${query}&` : ''}skip=${(currentPage + 1) * limit}&limit=${limit}`;
            navButtons.push(
                <li key='nextPage' className='nav-button link button-link'>
                    <Link to={nextPageUrl}>
                        <i className='material-icons'>chevron_right</i>
                    </Link>
                </li>,
                <li key='lastPage' className='nav-button link button-link'>
                    <Link to={`/media?${query ? `${query}&` : ''}skip=${(pageCount - 1) * limit}&limit=${limit}`}>
                        <i className='material-icons'>last_page</i>
                    </Link>
                </li>
            );
        }

        return (
            <ul className='nav-buttons'>
                {navButtons}
            </ul>
        );
    }

    public render(): ReactElement<ImagesPageThumbnailGalleryProps> {
        return (
            <div className='ImagesPageThumbnailGallery'>
                <ul className='thumbnail-list'>
                    {this.renderThumbnails()}
                    <li className='end-padding'/>
                </ul>
                <div className='page-navigation'>
                    {this.renderNavigation()}
                </div>
            </div>
        );
    }

    protected getBaseProps(): ImagesPageThumbnailGalleryProps {
        return ImagesPageThumbnailGallery.defaultProps;
    }
}

export default ImagesPageThumbnailGallery;
