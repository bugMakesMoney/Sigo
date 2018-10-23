"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Message_1 = require("./Message");
class Reply extends Message_1.default {
    getPayload() {
        return this.messaging.message.quick_reply.payload;
    }
    getText() {
        return this.messaging.message.text;
    }
}
exports.default = Reply;
