export interface DateModel {
  year: number
  month: number
  hour: number
  date: number
}

export interface CafeteriaModel<T> {
  data: string
  date: T
}
export interface DayCafeteriaModel {
  index: number
  type: string
  ko: string
}

export interface WeekCafeteriaModel {
  index: number[]
  type: string
  ko: string[]
}

export interface MatchCafeteriaModel {
  module: string
  options: {
    type: string
    value: number | string
  }
}
