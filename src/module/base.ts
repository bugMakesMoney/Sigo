import { DateModel } from '../model/cafeteriaModel'

export default class base {
  protected _currentDate: DateModel

  get currentDate() {
    return this._currentDate
  }

  set currentDate(currentDate) {
    this._currentDate = currentDate
  }
}
