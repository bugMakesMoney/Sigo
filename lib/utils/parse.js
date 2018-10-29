"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Url = require("url");
const types_1 = require("../constants/types");
const util_1 = require("./util");
const Reply_1 = require("../event/message/Reply");
const Text_1 = require("../event/message/Text");
const Attachments_1 = require("../event/message/Attachments");
const Delivery_1 = require("../event/Delivery");
const Read_1 = require("../event/Read");
const Postback_1 = require("../event/Postback");
exports.parseUrl = (url) => {
    const { query, pathname: path } = Url.parse(url, true);
    return {
        query,
        path,
    };
};
exports.parseEvent = (data) => {
    const { object, entry } = data;
    if (object !== 'page' || !entry)
        throw new Error('error event request');
    let event;
    const { id, time } = entry[0];
    const messaging = entry[0].messaging[0];
    const eventType = getEventType(messaging);
    if (eventType === types_1.EventTypes.MESSAGE)
        event = parseMessageEvent(id, time, messaging);
    if (eventType === types_1.EventTypes.DELIVERY)
        event = new Delivery_1.default(id, time, messaging);
    if (eventType === types_1.EventTypes.READ)
        event = new Read_1.default(id, time, messaging);
    if (eventType === types_1.EventTypes.POSTBACK)
        event = new Postback_1.default(id, time, messaging);
    return event;
};
const getEventType = messaging => {
    if ('message' in messaging && messaging.message.is_echo)
        return 'echo';
    const eventType = util_1.findObject(Object.values(types_1.EventTypes), messaging);
    if (!eventType)
        throw new Error('not found event types');
    return eventType;
};
const getMessageType = message => {
    const messageType = util_1.findObject(types_1.MessageTypes, message);
    if (!messageType)
        throw new Error('not found message types');
    return messageType;
};
const parseMessageEvent = (id, time, messaging) => {
    const { message } = messaging;
    const messageType = getMessageType(message);
    if (messageType === 'text')
        return new Text_1.default(id, time, messaging);
    if (messageType === 'attachments')
        return new Attachments_1.default(id, time, messaging);
    if (messageType === 'quick_reply')
        return new Reply_1.default(id, time, messaging);
};
