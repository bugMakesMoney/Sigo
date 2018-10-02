import Message from './Message';
import { AttachmentsModel } from '../../model/EventModel';
export default class Attachments extends Message<AttachmentsModel> {
    getAttachments(): {
        type: string;
        payload: object;
    };
    getAttachmentsPayload(): object;
    getAttachmentsType(): string;
}
