interface MessageInfoModel {
    mid: string;
    seq: string;
}
export interface EventModel {
    sender: {
        id: string;
    };
    recipient: {
        id: string;
    };
    timestamp: string;
}
export interface ReplyModel {
    text: string;
    quick_reply: {
        payload: string;
    };
}
export interface AttachmentsModel {
    attachment: {
        type: string;
        payload: object;
    };
}
export interface MessageModel<T> extends EventModel {
    message: T & MessageInfoModel;
}
export interface TextModel {
    text: string;
}
export interface EchoModel extends EventModel {
    is_echo: string;
}
export interface DeliveryModel extends EventModel {
    delivery: {
        watermark: number;
    } & MessageInfoModel;
}
export interface ReadModel extends EventModel {
    read: {
        watermark: number;
    } & MessageInfoModel;
}
export {};
