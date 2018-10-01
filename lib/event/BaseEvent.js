"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Event {
    constructor(id, time, messaging) {
        this.id = id;
        this.time = time;
        this.messaging = messaging;
    }
    getId() {
        return this.id;
    }
    getTime() {
        return this.time;
    }
    getSenderId() {
        return this.messaging.sender.id;
    }
    getRecipientId() {
        return this.messaging.recipient.id;
    }
    setEventType(eventType) {
        this.eventType = eventType;
    }
    getEventType() {
        return this.eventType;
    }
}
exports.default = Event;
