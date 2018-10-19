/// <reference types="node" />
import { MessageModel, TextModel, AttachmentsModel } from '../model/EventModel';
import Event from '../event/BaseEvent';
export declare const parseUrl: (url: string) => {
    query: import("querystring").ParsedUrlQuery;
    path: string;
};
export declare const parseEvent: (data: any) => Event<MessageModel<TextModel> | MessageModel<import("../model/EventModel").ReplyModel> | MessageModel<AttachmentsModel> | import("../model/EventModel").DeliveryModel | import("../model/EventModel").ReadModel | import("../model/EventModel").EchoModel>;
