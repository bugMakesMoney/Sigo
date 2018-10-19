"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseEvent_1 = require("./BaseEvent");
const types_1 = require("../constants/types");
class Read extends BaseEvent_1.default {
    constructor(id, time, messaging) {
        super(id, time, messaging);
        this.setEventType(types_1.EventTypes.READ);
    }
    getSeq() {
        return this.messaging.read.seq;
    }
    getMid() {
        return this.messaging.read.mid;
    }
}
exports.default = Read;
