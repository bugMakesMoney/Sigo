"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../constants/config");
exports.configKeyValidation = (config) => {
    if (!config)
        throw new Error('config is not defined');
    const configKeys = Object.keys(config);
    if (!configKeys.length)
        throw new Error('config is empty');
    const isPageInfo = Boolean(config.pageId || config.pageToken);
    const DefaultConfigKey = config_1.AppConfigKey.concat(isPageInfo ? config_1.PageConfigKey : []);
    return DefaultConfigKey.every(key => {
        if (!configKeys.includes(key))
            throw new Error(`${key} is not defined`);
        return configKeys.includes(key);
    });
};
exports.configValueValidation = (config) => {
    return Object.entries(config).every(([key, value]) => {
        return isValueCheck(key, value) ? typeCheck(key, value, 'string') : false;
    });
};
const isValueCheck = (key, value) => {
    if (!value) {
        throw new Error(`The value of ${key} is null`);
    }
    return true;
};
const typeCheck = (key, value, type) => {
    if (typeof value !== type) {
        throw new Error(`The value of ${key} must be ${type}, `);
    }
    return true;
};
exports.validationSignature = (appSecret, signature) => {
    if (!signature)
        throw new Error('signature is empty');
    return true;
};
