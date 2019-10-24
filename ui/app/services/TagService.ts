export default class TagService {
    public static toTagId(displayName: string): string {
        return typeof displayName === 'string'
            ? displayName.replace(/ /g, '_').toLowerCase()
            : displayName;
    }

    public static toDisplayName(tagId: string): string {
        return typeof tagId === 'string'
            ? tagId.replace(/_/g, ' ')
            : tagId;
    }
}
