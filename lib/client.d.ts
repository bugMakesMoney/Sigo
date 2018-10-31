/// <reference types="node" />
import * as Http from 'http';
import { AppConfigModel, ReplyMessageModel } from './model';
export default class client {
    server: Http.Server;
    private endpoint;
    private version;
    private verifyToken;
    private webhookUrl;
    private appSecret;
    private accessToken;
    constructor(config: AppConfigModel, server?: Http.Server);
    protected appInfo(): {
        endpoint: string;
        version: string;
        verifyToken: string;
        appSecret: string;
        accessToken: string;
    };
    subscribe: (eventType: string, listener: (userId: any, message: any) => Promise<void>) => Http.Server;
    private setClientConfig;
    setWebhook: (webhookUrl: string) => any;
    private handleGET;
    private handlePOST;
    private handleEvent;
    private emitEvent;
    private requestCallback;
    listen: (port: number & string) => void;
    private requestGet;
    private requestPost;
    protected sendMessage: (recipientId: any, message: any) => any;
    protected sendAction: (recipientId: any, action: any) => any;
    protected sendAttachment: (recipientId: any, { type, payload_url, reusable }: {
        type: any;
        payload_url: any;
        reusable: any;
    }) => any;
    protected sendQuickReply: (recipientId: any, { text, quick_replies }: ReplyMessageModel) => any;
    protected createBroadcast: (messages: any) => any;
    protected braodcast: (broadCastData: any) => any;
    protected getUser: (userId: any) => any;
    private sendRequest;
}
