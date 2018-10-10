export interface MatchTitleModel {
  title?: string
}

export interface MatchValueModel {
  matches: {
    value: string
    key: string
    arrayIndex: number
  }[]
}

export interface MatchResultModel {
  item: {
    title: string
    values: []
  }
  matches: {
    value: string
    key: string
    arrayIndex: number
  }[]
  score: number
}
