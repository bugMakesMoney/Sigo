"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("./client");
class fbMessenger extends client_1.default {
    constructor() {
        super(...arguments);
        this.sendTextMessage = (senderId, textMessage) => {
            return this.sendMessage(senderId, { text: textMessage });
        };
    }
}
exports.fbMessenger = fbMessenger;
