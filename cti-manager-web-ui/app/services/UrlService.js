import _ from 'lodash';
import queryString from 'query-string';

export default class UrlService {
    static createQueryString(parameterMap) {
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

    static parseQueryString(search) {
        return queryString.parse(search);
    }

    static createAbsoluteUrl(url) {
        const schemeRegex = /^https?\:\/\//;
        return schemeRegex.test(url) ? url : `http://${url}`;
    }
}
