export default class TagService {
    static toTagId(displayName) {
        return typeof displayName === 'string' ? displayName.replace(/ /g, '_') : displayName;
    }

    static toDisplayName(tagId) {
        return typeof tagId === 'string' ? tagId.replace(/_/g, ' ') : tagId;
    }
}
