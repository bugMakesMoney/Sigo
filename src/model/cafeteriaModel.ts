export interface DateModel {
  year: number
  month: number
  hour: number
  day: number
}

export interface RmqtlrModel<T> {
  data: string
  date: T
}
export interface DayRmqtlrModel {
  index: number
  ko: string
}
