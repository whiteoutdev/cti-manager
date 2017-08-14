import * as _ from 'lodash';
import * as queryString from 'query-string';

export default class UrlService {
    public static createQueryString(parameterMap: {[key: string]: any}): string {
        let query = '?';
        _.each(parameterMap, (param, key) => {
            if (param !== null && typeof param !== 'undefined') {
                if (query !== '?') {
                    query += '&';
                }
                query += `${key}=${param}`;
            }
        });
        return query === '?' ? '' : query;
    }

    public static parseQueryString(search: string): {[key: string]: any} {
        return queryString.parse(search);
    }

    public static createAbsoluteUrl(url: string): string {
        const schemeRegex = /^https?:\/\//;
        return schemeRegex.test(url) ? url : `http://${url}`;
    }
}
