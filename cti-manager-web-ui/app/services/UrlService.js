import _ from 'lodash';

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
};