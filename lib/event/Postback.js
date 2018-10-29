"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseEvent_1 = require("./BaseEvent");
const types_1 = require("../constants/types");
class Postback extends BaseEvent_1.default {
    constructor(id, time, messaging) {
        super(id, time, messaging);
        this.getPostbackPayload = () => this.messaging.postback.payload;
        this.getPostbackTitle = () => this.messaging.postback.title;
        this.setEventType(types_1.EventTypes.POSTBACK);
    }
}
exports.default = Postback;
