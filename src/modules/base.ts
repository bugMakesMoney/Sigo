import { DateModel } from '../model/cafeteriaModel'

export default class base {
  protected _currentDate: DateModel
  protected _message: string

  get currentDate() {
    return this._currentDate
  }

  set currentDate(currentDate) {
    this._currentDate = currentDate
  }

  get message() {
    return this._message
  }

  set message(message) {
    this._message = message
  }
}
