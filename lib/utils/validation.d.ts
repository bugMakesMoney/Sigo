import { AppConfigModel } from '../model/ConfigModel';
export declare const configKeyValidation: (config: AppConfigModel) => boolean;
export declare const configValueValidation: (config: AppConfigModel) => boolean;
export declare const validationSignature: (appSecret: any, signature: any) => boolean;
