export interface DateModel {
  year: number
  month: number
  hour: number
  date: number
}

export interface CafeteriaModel {
  data: string
  type: string
}

export interface MatchCafeteriaModel {
  module: string
  options: {
    type: string
    value: number | string
  }
}
