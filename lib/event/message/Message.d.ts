import Event from '../BaseEvent';
import { MessageModel } from '../../model/EventModel';
export default class Message<T> extends Event<MessageModel<T>> {
    constructor(id: string, time: string, messaging: MessageModel<T>);
    isText(): boolean;
    isReply(): boolean;
    isAttachments(): boolean;
    getMessaging(): import("../../model/EventModel").EventModel & MessageModel<T>;
    getSeq(): string;
    getMid(): string;
}
