import Attachments from './messageEvent/Attachments';
import Reply from './messageEvent/Reply';
import Read from './Read';
import Delivery from './Delivery';
export declare type Message = Attachments & Reply & Text & Read & Delivery;
