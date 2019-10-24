import appConfig from '../config/app.config';

export function createUrl(path: string, params: {[key: string]: any} = {}): string {
    let url = path;
    const paramParts = Object.keys(params)
        .filter(key => !!String(params[key]))
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(String(params[key]))}`);
    if (paramParts.length) {
        url += `?${paramParts.join('&')}`;
    }
    return url;
}

export function createMediaPageUrl(tags: string[] = [], skip = 0, limit = appConfig.images.defaultPageLimit): string {
    return createUrl('/media', {
        tags: tags.join(),
        skip,
        limit
    });
}
