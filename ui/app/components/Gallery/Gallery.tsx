import {isEqual} from 'lodash';
import * as React from 'react';
import {Component, ReactElement, ReactNode} from 'react';
import {Link} from 'react-router-dom';
import MediaApi from '../../api/MediaApi';
import './Gallery.scss';

interface GalleryProps {
    ids: string[];
}

class Gallery extends Component<GalleryProps, {}> {
    public static defaultProps: GalleryProps = {
        ids: []
    };

    public shouldComponentUpdate(nextProps: GalleryProps): boolean {
        return !isEqual(nextProps, this.props);
    }

    public renderThumbnails(): ReactNode {
        if (this.props.ids) {
            return this.props.ids.map(id => {
                return (
                    <li key={id} className='thumbnail-list-item'>
                        <Link to={`/media/${id}`}>
                            <img src={MediaApi.getMediaThumbnailDownloadUrl(id)} alt={id}/>
                        </Link>
                    </li>
                );
            });
        }
    }

    public render(): ReactElement<GalleryProps> {
        return (
            <div className='ImagesPageThumbnailGallery'>
                <ul className='thumbnail-list'>
                    {this.renderThumbnails()}
                    <li className='end-padding'/>
                </ul>
            </div>
        );
    }
}

export default Gallery;
