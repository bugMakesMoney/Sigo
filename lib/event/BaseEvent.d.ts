import { EventModel } from '../model/EventModel';
import { defaultEventModel } from './Types';
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
