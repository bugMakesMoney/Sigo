import { ReplyOptionsModel } from '../model/MessageModel';
import { Message } from './Message';
export declare class ReplyMessage extends Message {
    options: ReplyOptionsModel[];
    constructor(text: any);
    addOptions(options: any): void;
    addText(title: any, payload: any): ReplyOptionsModel[];
    addImage(title: any, payload: any, image_url: any): ReplyOptionsModel[];
    addLocation(): ReplyOptionsModel[];
    addPhoneNumber(): ReplyOptionsModel[];
    addUserEmail(): ReplyOptionsModel[];
    getOptions(): ReplyOptionsModel[];
    buildReply(): {
        text: string;
        quick_replies: ReplyOptionsModel[];
    };
}
