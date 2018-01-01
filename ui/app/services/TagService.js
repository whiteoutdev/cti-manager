export default class TagService {
    static toTagId(displayName) {
        return typeof displayName === 'string' ? displayName.replace(/ /g, '_').toLowerCase() : displayName;
    }

    static toDisplayName(tagId) {
        return typeof tagId === 'string' ? tagId.replace(/_/g, ' ') : tagId;
    }
}
