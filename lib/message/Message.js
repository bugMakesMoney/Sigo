"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Message {
    constructor(text) {
        this.text = text;
    }
    setText(text) {
        this.text = text;
    }
    getText() {
        return this.text;
    }
}
exports.Message = Message;
