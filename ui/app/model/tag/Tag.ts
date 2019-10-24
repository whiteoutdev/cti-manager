import TagMetadata from './TagMetadata';

interface Tag {
    id: string;
    type: string;
    derivedTags: string[];
    metadata: TagMetadata;
}

export default Tag;
