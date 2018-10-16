import { DateModel } from '../model/cafeteriaModel'

export default class base {
  protected _currentDate: DateModel
  protected _message: string
  protected _url: string
  protected _options: any
  protected _data: Cheerio

  get currentDate() {
    return this._currentDate
  }

  set currentDate(currentDate) {
    this._currentDate = currentDate
  }

  protected reloadCurrentDate() {
    const date = new Date()
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      hour: date.getHours(),
      date: date.getDate(),
    }
  }

  get message() {
    return this._message
  }

  set message(message) {
    this._message = message
  }

  get url() {
    return this._url
  }

  set url(url) {
    this._url = url
  }

  get data() {
    return this._data
  }

  set data(data) {
    this._data = data
  }

  get options() {
    return this._options
  }

  set options(options) {
    this._options = options
  }
}
