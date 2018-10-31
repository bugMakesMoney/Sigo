"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventTypes = {
    MESSAGE: 'message',
    DELIVERY: 'delivery',
    READ: 'read',
    ECHO: 'echo',
    POSTBACK: 'postback',
    OPTIN: 'optin',
    REFERRAL: 'referral',
    PAYMENTS: 'payment',
    CHECKOUT_UPDATE: 'checkout_update',
    ACCOUNT_LINKING: 'account_linking',
};
exports.ActionTypes = {
    TYPING_ON: 'typing_on',
    TYPING_OFF: 'typing_off',
};
exports.notificationType = {
    REGULAR: 'REGULAR',
    SILENT_PUSH: 'SILENT_PUSH',
    NO_PUSH: 'NO_PUSH',
};
exports.MessageTypes = ['quick_reply', 'text', 'attachments'];
