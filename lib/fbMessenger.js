"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("./client");
const types_1 = require("./constants/types");
class fbMessenger extends client_1.default {
    constructor() {
        super(...arguments);
        this.sendTextMessage = (senderId, textMessage) => {
            return this.sendMessage(senderId, { text: textMessage });
        };
        this.sendTypingOn = senderId => this.sendAction(senderId, types_1.ActionTypes.TYPING_ON);
        this.sendTypingOff = senderId => this.sendAction(senderId, types_1.ActionTypes.TYPING_OFF);
    }
}
exports.fbMessenger = fbMessenger;
