"use strict";
const bot_1 = require("./bot");
class fbMessenger extends bot_1.default {
    constructor(config, server) {
        super(config, server);
    }
    webhook(webhookUrl) {
        return this.server.setWebhook(webhookUrl);
    }
    listen(port) {
        this.server.listen(port);
    }
}
module.exports = fbMessenger;
