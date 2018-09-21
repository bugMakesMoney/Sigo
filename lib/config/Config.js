"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validation_1 = require("../utils/validation");
const config_1 = require("../constants/config");
class appConfig {
    constructor(_config) {
        this.validation(_config);
        const defaultConfig = this.setDefaultValue();
        const config = Object.assign(_config, defaultConfig);
        Object.entries(config).forEach(([key, value]) => {
            this[key] = value;
        });
    }
    setDefaultValue() {
        return {
            webhook: config_1.WebhookUrl,
            endpoint: config_1.Endpoint,
            version: config_1.EndpointVersion,
        };
    }
    validation(config) {
        validation_1.configKeyValidation(config);
        validation_1.configValueValidation(config);
    }
}
exports.appConfig = appConfig;
