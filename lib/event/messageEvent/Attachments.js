"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Message_1 = require("./Message");
class Attachments extends Message_1.default {
    getAttachments() {
        return this.messaging.message.attachment;
    }
    getAttachmentsPayload() {
        return this.messaging.message.attachment.payload;
    }
    getAttachmentsType() {
        return this.messaging.message.attachment.type;
    }
}
exports.default = Attachments;
