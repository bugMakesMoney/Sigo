/// <reference types="node" />
import * as Http from 'http';
import { AppConfigModel } from './model';
export default class client {
    server: Http.Server;
    endpoint: string;
    version: string;
    private verifyToken;
    private webhookUrl;
    private appSecret;
    private accessToken;
    private pageId?;
    private pageToken?;
    constructor(config: AppConfigModel, server?: Http.Server);
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
    private sendRequest;
}
