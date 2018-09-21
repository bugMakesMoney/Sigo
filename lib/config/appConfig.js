"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const validation_1 = require("../utils/validation");
class appConfig {
    constructor(_config) {
        this.validation(_config);
        const { verifyToken } = _config, appConfig = __rest(_config, ["verifyToken"]);
        Object.entries(appConfig).forEach(([key, value]) => {
            this[key] = value;
        });
    }
    validation(config) {
        validation_1.configKeyValidation(config);
        validation_1.configValueValidation(config);
    }
}
exports.default = appConfig;
