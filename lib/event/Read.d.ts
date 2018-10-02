import Event from './BaseEvent';
import { ReadModel } from '../model/EventModel';
export default class Delivery extends Event<ReadModel> {
    constructor(id: string, time: string, messaging: ReadModel);
    getSeq(): string;
    getMid(): string;
}
