"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseEvent_1 = require("./BaseEvent");
const types_1 = require("../constants/types");
class Delivery extends BaseEvent_1.default {
    constructor(id, time, messaging) {
        super(id, time, messaging);
        this.setEventType(types_1.EventTypes.DELIVERY);
    }
    getSeq() {
        return this.messaging.delivery.seq;
    }
    getMid() {
        return this.messaging.delivery.mid;
    }
}
exports.default = Delivery;
