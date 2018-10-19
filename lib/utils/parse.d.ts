/// <reference types="node" />
import { MessageModel, TextModel, AttachmentsModel } from '../model/EventModel';
import Event from '../event/BaseEvent';
export declare const parseUrl: (url: string) => {
    query: import("querystring").ParsedUrlQuery;
    path: string;
};
export declare const parseEvent: (data: any) => Event<import("../model/EventModel").EchoModel | import("../model/EventModel").DeliveryModel | import("../model/EventModel").ReadModel | MessageModel<TextModel> | MessageModel<import("../model/EventModel").ReplyModel> | MessageModel<AttachmentsModel>>;
