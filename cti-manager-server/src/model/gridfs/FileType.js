import _ from 'lodash';

class FileType {
    constructor(name, code) {
        this.name = name;
        this.code = code;
    }
}

export default {
    IMAGE    : new FileType('image', 1),
    THUMBNAIL: new FileType('thumbnail', 2),

    fromCode(code) {
        return _.find(this, (fileType) => {
            return fileType.code === code;
        });
    }
};
