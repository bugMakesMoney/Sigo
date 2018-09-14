export interface ConfigModel {
  appSecret: string
  accessToken: string
  verifyToken: string
  pageId?: number
  pageToken?: string
}

export interface AppConfigModel extends ConfigModel {
  endpoint: string
  version: string
  webhook: string
}
