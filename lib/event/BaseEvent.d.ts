import { TextModel, AttachmentsModel, ReplyModel, EventModel, MessageModel, ReadModel, DeliveryModel, EchoModel } from '../model/EventModel';
declare type defaultEventModel = MessageModel<TextModel> | MessageModel<ReplyModel> | MessageModel<AttachmentsModel> | DeliveryModel | ReadModel | EchoModel;
export default class Event<T = defaultEventModel> {
    id: string;
    time: string;
    messaging: EventModel & T;
    eventType: string;
    constructor(id: string, time: string, messaging: EventModel & T);
    getId(): string;
    getTime(): string;
    getSenderId(): string;
    getRecipientId(): string;
    setEventType(eventType: any): void;
    getEventType(): string;
}
export {};
