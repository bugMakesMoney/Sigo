export interface ReportItemModel {
  userId: string
  userName: string
  isAnonymous: boolean
  reportText: string
  pictures?: string[]
  accessToken: string
  version: string
  endpoint: string
}
