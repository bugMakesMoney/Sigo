import client from './client';
import { ReplyMessageModel, UserProfileModel } from './model';
export declare class fbMessenger extends client {
    sendTextMessage: (senderId: any, textMessage: any) => any;
    sendTypingOn: (senderId: any) => any;
    sendTypingOff: (senderId: any) => any;
    sendImageUrl: (senderId: any, payload_url: string, reusable?: Boolean) => any;
    sendReply: (senderId: any, replies: ReplyMessageModel) => any;
    getUserProfile: (userId: any) => UserProfileModel;
    getAppInfo: () => {
        endpoint: string;
        version: string;
        verifyToken: string;
        appSecret: string;
        accessToken: string;
        pageId: string;
        pageToken: string;
    };
}
