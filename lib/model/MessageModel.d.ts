export interface ReplyMessageModel {
    text: string;
    quick_replies: ReplyOptionsModel[];
}
export interface ReplyOptionsModel {
    content_type: string;
    title: string;
    payload: string;
    image_url?: string;
}
