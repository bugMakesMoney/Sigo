import * as cheerio from 'cheerio'
import * as request from 'request-promise'

import base from './base'
import {
  DateModel,
  DayCafeteriaModel,
  WeekCafeteriaModel,
} from '../model/cafeteriaModel'
import { parseCafeteria } from '../utils/parse'
import { cafeteriaUrl } from '../constants/url'
import { TYPE } from '../constants/matchTypes'

export default class cafeteria extends base {
  private _url: string
  private _data: Cheerio
  private _rmqtlr: any
  private _options: any
  constructor(date?: DateModel) {
    super()
    this._url = cafeteriaUrl
    this.loadCafeteria(date)
  }
  get url() {
    return this._url
  }

  set url(url) {
    this._url = url
  }

  get prmqtlr() {
    return this._rmqtlr
  }

  set rmqtlr(rmqtlr) {
    this._rmqtlr = rmqtlr
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

  private loadCafeteria = async (date?: DateModel) => {
    let targetDate: string
    if (date) {
      targetDate = date.year.toString() + date.month.toString()
    } else {
      const date = new Date()
      this.currentDate = {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        hour: date.getHours(),
        date: date.getDate(),
      }
      const { year, month } = this.currentDate
      targetDate = year.toString() + month.toString()
    }
    this.url = this.url.replace('{targetDate}', targetDate)
    await request(this.url, (err, res, body) => {
      if (err) console.log('err', err)
      const data = cheerio.load(body, {
        decodeEntities: false,
        normalizeWhitespace: false,
      })

      this.data = data('tbody')
      console.log('load cafeteria data')
    })
  }
  public getCafeteria = (options?) => {
    const { type, value } = (this.options = options)
    const { date } = this.currentDate
    if (type === TYPE.ERROR)
      return {
        date: {
          index: value,
          type,
        },
      }
    if (type === TYPE.TODAY)
      return parseCafeteria<DayCafeteriaModel>(this.data, date, type)
    if (type === TYPE.TOMORROW)
      return parseCafeteria<DayCafeteriaModel>(this.data, date + 1, type)
    if (type === TYPE.TARGET)
      return parseCafeteria<DayCafeteriaModel>(this.data, value, type)
    if (type === TYPE.DAYKO)
      return parseCafeteria<DayCafeteriaModel>(this.data, date, type, value)
    if (type === TYPE.THIS)
      return parseCafeteria<WeekCafeteriaModel>(this.data, date, type)
    if (type === TYPE.NEXT)
      return parseCafeteria<WeekCafeteriaModel>(this.data, date + 7, type)
  }
}
