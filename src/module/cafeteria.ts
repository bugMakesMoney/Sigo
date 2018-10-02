import * as cheerio from 'cheerio'
import * as request from 'request-promise'

import base from './base'
import { DateModel, DayRmqtlrModel } from '../model/cafeteriaModel'
import { parseDayRmqtlr } from '../utils/parse'

export default class cafeteria extends base {
  private _url: string
  private _rmqtlr: Cheerio
  constructor(url: string) {
    super()
    this._url = url
  }
  get url() {
    return this._url
  }

  set url(url) {
    this._url = url
  }

  get rmqtlr() {
    return this._rmqtlr
  }

  set rmqtlr(rmqtlr) {
    this._rmqtlr = rmqtlr
  }

  loadRmqtlr(date?: DateModel) {
    let targetDate: string
    if (date) {
      targetDate = date.year.toString() + date.month.toString()
    } else {
      const date = new Date()
      this.currentDate = {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        hour: date.getHours(),
        day: date.getDay(),
      }
      const { year, month } = this.currentDate
      targetDate = year.toString() + month.toString()
    }
    this.url = this.url.replace('{targetDate}', targetDate)
    return request(this.url, (err, res, body) => {
      if (err) console.log('err', err)
      const data = cheerio.load(body, {
        decodeEntities: false,
        normalizeWhitespace: false,
      })
      this.rmqtlr = data('tbody')
    })
  }

  get toadyRmqtlr() {
    const { day } = this.currentDate
    return parseDayRmqtlr<DayRmqtlrModel>(this.rmqtlr, day)
  }

  get tomorrowRmqtlr() {
    const { day } = this.currentDate
    return parseDayRmqtlr<DayRmqtlrModel>(this.rmqtlr, day + 1)
  }
}
