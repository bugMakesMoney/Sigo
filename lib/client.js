"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serverConfig_1 = require("./config/serverConfig");
const appConfig_1 = require("./config/appConfig");
class client {
    constructor(config, server) {
        this.app = new appConfig_1.default(config);
        const { verifyToken } = config;
        this.server = new serverConfig_1.default(verifyToken, server);
    }
}
exports.default = client;
