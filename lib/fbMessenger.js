"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("./client");
const types_1 = require("./constants/types");
class fbMessenger extends client_1.default {
    constructor() {
        super(...arguments);
        this.sendTextMessage = (senderId, textMessage) => {
            return this.sendMessage(senderId, textMessage);
        };
        this.sendTypingOn = senderId => this.sendAction(senderId, types_1.ActionTypes.TYPING_ON);
        this.sendTypingOff = senderId => this.sendAction(senderId, types_1.ActionTypes.TYPING_OFF);
        this.sendImageUrl = (senderId, payload_url, reusable = false) => {
            const attachment = {
                type: 'image',
                payload_url,
                reusable,
            };
            return this.sendAttachment(senderId, attachment);
        };
        this.sendReply = (senderId, replies) => {
            return this.sendQuickReply(senderId, replies);
        };
        this.getUserProfile = (userId) => {
            return this.getUser(userId);
        };
    }
}
exports.fbMessenger = fbMessenger;
