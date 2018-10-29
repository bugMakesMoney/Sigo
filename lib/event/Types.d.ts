import Attachments from './message/Attachments';
import Reply from './message/Reply';
import Read from './Read';
import Delivery from './Delivery';
import { TextModel, AttachmentsModel, ReplyModel, MessageModel, ReadModel, DeliveryModel, EchoModel } from '../model/EventModel';
import Postback from './Postback';
export declare type MessageType = Attachments & Reply & Text & Read & Delivery;
export declare type PostbackType = Postback;
export declare type defaultEventModel = MessageModel<TextModel> | MessageModel<ReplyModel> | MessageModel<AttachmentsModel> | DeliveryModel | ReadModel | EchoModel;
