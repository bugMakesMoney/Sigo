import Message from './Message';
import { TextModel } from '../../model/EventModel';
export default class Text extends Message<TextModel> {
    getText(): string;
}
