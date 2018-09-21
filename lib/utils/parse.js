"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Url = require("url");
exports.parseUrl = (url) => {
    const { query, pathname: path } = Url.parse(url, true);
    return {
        query,
        path,
    };
};
