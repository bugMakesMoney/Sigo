export interface ReportItemModel {
  userId: string
  userName: string
  isAnonymous: boolean
  reportText: string
  pictures?: string[]
  pageToken: string
  version: string
  endpoint: string
}
