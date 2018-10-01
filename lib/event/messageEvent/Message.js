"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseEvent_1 = require("../BaseEvent");
const types_1 = require("../../constants/types");
class Message extends BaseEvent_1.default {
    constructor(id, time, messaging) {
        super(id, time, messaging);
        this.setEventType(types_1.EventTypes.MESSAGE);
    }
    isText() {
        return 'text' in this.messaging.message && !this.isReply();
    }
    isReply() {
        return 'quick_reply' in this.messaging.message;
    }
    isAttachments() {
        return 'attachments' in this.messaging.message;
    }
    getMessaging() {
        return this.messaging;
    }
    getSeq() {
        return this.messaging.message.seq;
    }
    getMid() {
        return this.messaging.message.mid;
    }
}
exports.default = Message;
