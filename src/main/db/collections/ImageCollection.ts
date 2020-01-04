import {Image, ImageDocument} from '../../../common/types/models/Image';
import {AbstractCollection} from '../AbstractCollection';

export class ImageCollection extends AbstractCollection<Image, ImageDocument> {
    protected toDoc(model: Image): ImageDocument {
        return {
            _id     : model.id,
            path    : model.path,
            mimeType: model.mimeType,
        };
    }

    protected toModel(doc: ImageDocument): Image {
        return {
            id      : doc._id,
            path    : doc.path,
            mimeType: doc.mimeType,
        };
    }
}
