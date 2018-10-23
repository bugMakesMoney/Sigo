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
  module: string | string[]
  options?: {
    type: string
    value: number | string | number[] | string[]
  }
}

export interface TextMatchModel {
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
