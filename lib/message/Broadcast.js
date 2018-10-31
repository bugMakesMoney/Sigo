"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Broadcast {
    constructor(id, notiType, msgType, tag) {
        this.id = id;
        this.notiType = notiType;
        this.msgType = msgType;
        this.tag = tag;
    }
    getId() {
        return this.id;
    }
    getNotiType() {
        return this.notiType;
    }
    getMsgType() {
        return this.msgType;
    }
    getTag() {
        return this.tag;
    }
    buildBroadcast() {
        const { id, notiType, msgType, tag } = this;
        return {
            message_creative_id: id,
            notification_type: notiType,
            messaging_type: msgType,
            tag,
        };
    }
}
exports.Broadcast = Broadcast;
