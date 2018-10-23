import Message from './Message';
import { AttachmentsModel, AttachmentsInfoModel } from '../../model/EventModel';
export default class Attachments extends Message<AttachmentsModel> {
    getAttachments(): AttachmentsInfoModel[];
}
