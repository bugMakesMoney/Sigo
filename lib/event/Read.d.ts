import Event from './BaseEvent';
import { ReadModel } from '../model/EventModel';
export default class Read extends Event<ReadModel> {
    constructor(id: string, time: string, messaging: ReadModel);
    getSeq(): string;
    getMid(): string;
}
