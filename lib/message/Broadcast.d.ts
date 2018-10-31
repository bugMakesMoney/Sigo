export declare class Broadcast {
    private id;
    private notiType;
    private msgType;
    private tag;
    constructor(id: any, notiType: any, msgType: any, tag: any);
    getId(): string;
    getNotiType(): string;
    getMsgType(): string;
    getTag(): string;
    buildBroadcast(): {
        message_creative_id: string;
        notification_type: string;
        messaging_type: string;
        tag: string;
    };
}
