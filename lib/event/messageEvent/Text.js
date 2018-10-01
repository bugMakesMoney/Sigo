"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Message_1 = require("./Message");
class Text extends Message_1.default {
    getText() {
        return this.messaging.message.text;
    }
}
exports.default = Text;
