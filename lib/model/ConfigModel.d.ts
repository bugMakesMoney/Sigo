export interface AppConfigModel {
    appSecret: string;
    accessToken: string;
    verifyToken: string;
    pageId?: string;
    pageToken?: string;
}
export interface ClientConfigModel {
    webhook: string;
    endpoint: string;
    version: string;
}
