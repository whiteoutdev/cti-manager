export default class TagService {
    static toTagId(displayName: string) {
        return typeof displayName === 'string'
            ? displayName.replace(/ /g, '_').toLowerCase()
            : displayName;
    }

    static toDisplayName(tagId: string) {
        return typeof tagId === 'string'
            ? tagId.replace(/_/g, ' ')
            : tagId;
    }
}
