import * as _ from 'lodash';
import * as queryString from 'query-string';

export default class UrlService {
    static createQueryString(parameterMap: any) {
        let queryString = '?';
        _.each(parameterMap, (param, key) => {
            if (param !== null && typeof param !== 'undefined') {
                if (queryString !== '?') {
                    queryString += '&';
                }
                queryString += `${key}=${param}`;
            }
        });
        return queryString === '?' ? '' : queryString;
    }

    static parseQueryString(search: string) {
        return queryString.parse(search);
    }

    static createAbsoluteUrl(url: string) {
        const schemeRegex = /^https?:\/\//;
        return schemeRegex.test(url) ? url : `http://${url}`;
    }
}
