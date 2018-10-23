"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Message_1 = require("./Message");
class ReplyMessage extends Message_1.Message {
    constructor(text) {
        super(text);
        this.options = [];
    }
    addOptions(options) {
        this.options.push(options);
    }
    addText(title, payload) {
        this.addOptions({
            content_type: 'text',
            title,
            payload,
        });
        return this.options;
    }
    addImage(title, payload, image_url) {
        this.addOptions({
            content_type: 'image',
            title,
            payload,
            image_url,
        });
        return this.options;
    }
    addLocation() {
        this.addOptions({
            content_type: 'location',
        });
        return this.options;
    }
    addPhoneNumber() {
        this.addOptions({
            content_type: 'user_phone_number',
        });
        return this.options;
    }
    addUserEmail() {
        this.addOptions({
            content_type: 'user_email',
        });
        return this.options;
    }
    getOptions() {
        return this.options;
    }
    makeMessage() {
        return {
            text: this.text,
            quick_replies: this.options,
        };
    }
}
exports.ReplyMessage = ReplyMessage;
