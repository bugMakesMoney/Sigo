import Message from './Message';
import { ReplyModel } from '../../model/EventModel';
export default class Reply extends Message<ReplyModel> {
    getPayload(): string;
    getText(): string;
}
