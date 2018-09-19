export interface ConfigModel {
  appSecret: string
  accessToken: string
  verifyToken: string
  pageId?: string
  pageToken?: string
}

export interface AppConfigModel extends ConfigModel {
  endpoint: string
  version: string
  webhook: string
}
