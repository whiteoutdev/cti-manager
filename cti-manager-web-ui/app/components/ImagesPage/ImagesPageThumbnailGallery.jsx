import React from 'react';

import appConfig from '../../config/app.config';

import './ImagesPageThumbnailGallery.scss';

export default class ImagesPageThumbnailGallery extends React.Component {
    shouldComponentUpdate(nextProps) {
        return JSON.stringify(nextProps) !== JSON.stringify(this.props);
    }

    renderThumbnails() {
        if (this.props.ids) {
            return this.props.ids.map((id) => {
                return (
                    <li key={id} className="thumbnail-list-item">
                        <a href={`${appConfig.api.path}/images/${id}/download`}>
                            <img src={`${appConfig.api.path}/images/${id}/thumbnail/download`} alt={id}/>
                        </a>
                    </li>
                );
            });
        }
    }

    render() {
        console.log(this.props);
        return (
            <div className="ImagesPageThumbnailGallery">
                <ul className="thumbnail-list">
                    {this.renderThumbnails()}
                    <li className="end-padding"/>
                </ul>
            </div>
        );
    }
};
