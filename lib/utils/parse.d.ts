/// <reference types="node" />
import Event from '../event/BaseEvent';
export declare const parseUrl: (url: string) => {
    query: import("querystring").ParsedUrlQuery;
    path: string;
};
export declare const parseEvent: (data: any) => Event<import("../event/Types").defaultEventModel>;
