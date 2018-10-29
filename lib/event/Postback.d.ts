import Event from './BaseEvent';
import { PostbackModel } from '../model/EventModel';
export default class Postback extends Event<PostbackModel> {
    constructor(id: string, time: string, messaging: PostbackModel);
    getPostbackPayload: () => string;
    getPostbackTitle: () => string;
}
