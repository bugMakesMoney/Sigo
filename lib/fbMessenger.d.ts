import client from './client';
export declare class fbMessenger extends client {
    sendTextMessage: (senderId: any, textMessage: any) => any;
    sendTypingOn: (senderId: any) => any;
    sendTypingOff: (senderId: any) => any;
}
