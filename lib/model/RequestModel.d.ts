export interface RequestQueryModel {
    ['hub.verify_token']?: string;
    ['hub.mode']?: string;
    ['hub.challenge']?: string;
}
export interface requestResultModel {
    result: requestSuccessModel | requestFailModel;
    statusCode: number;
}
interface requestSuccessModel {
    recipient_id: string;
    message_id: string;
}
interface requestFailModel {
    message: string;
    type: string;
    code: number;
    error_subcode: number;
    fbtrace_id: string;
}
export interface UserProfileModel {
    name: string;
    profile_pic: string;
    gender: string;
}
export {};
