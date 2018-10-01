"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Url = require("url");
const queryString = require("querystring");
const parse_1 = require("./parse");
exports.isSame = (a, b) => {
    return a === b;
};
exports.findObject = (a, b) => {
    return a.find(_a => _a in b);
};
exports.urlDefaultQuery = (url, defaultQuery) => {
    const requestUrl = new URL(url);
    const { query } = parse_1.parseUrl(url);
    requestUrl.search =
        '?' + queryString.stringify(Object.assign(query, defaultQuery));
    return Url.format(requestUrl);
};
