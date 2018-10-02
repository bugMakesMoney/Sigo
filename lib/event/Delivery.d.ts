import Event from './BaseEvent';
import { DeliveryModel } from '../model/EventModel';
export default class Delivery extends Event<DeliveryModel> {
    constructor(id: string, time: string, messaging: DeliveryModel);
    getSeq(): string;
    getMid(): string;
}
