import * as cheerio from 'cheerio'
import * as request from 'request-promise'

import base from './base'
import { DateModel } from '../model'
import { parseCafeteria } from '../utils/parse'
import { cafeteriaUrl } from '../constants/url'
import { TYPE } from '../constants/matchTypes'

export default class cafeteria extends base {
  private _rmqtlr: any
  constructor(targetMonth?: number | string) {
    super()
    this.url = targetMonth
      ? cafeteriaUrl.replace(
          '{targetDate}',
          new Date().getFullYear().toString() + targetMonth.toString()
        )
      : cafeteriaUrl
    this.loadCafeteria()
  }

  get rmqtlr() {
    return this._rmqtlr
  }

  set rmqtlr(rmqtlr) {
    this._rmqtlr = rmqtlr
  }

  private loadCafeteria = async (date?: DateModel) => {
    let targetDate: string
    this.currentDate = this.reloadCurrentDate()
    const { year, month } = date || this.currentDate

    targetDate = `${year.toString()}${
      month < 10 ? '0' + month.toString() : month.toString()
    }`
    this.url = this.url.replace('{targetDate}', targetDate)

    try {
      const body = await request(this.url)
      const data = cheerio.load(body, {
        decodeEntities: false,
        normalizeWhitespace: false,
      })
      this.data = data('tbody')

      console.log('load cafeteria data')
    } catch (err) {
      console.error('load cafeteria err', err)
      console.info('retry load cafeteria')
      this.loadCafeteria()
    }
  }
  public getCafeteria = async (options?) => {
    let { date: _reloadDate } = (this.currentDate = this.reloadCurrentDate())

    console.log('a')

    if (_reloadDate !== this.currentDate.date) {
      console.log('date is changed. load new cafeteria')
      this.loadCafeteria()
    }

    if (
      JSON.stringify(this.options) === JSON.stringify(options) &&
      this.options
    ) {
      console.log('same options')
      return this.rmqtlr
    }

    const { type = '', value = '' } = (this.options = options) || {}

    const { date } = this.currentDate

    if (type === TYPE.TODAY) {
      this.rmqtlr = await parseCafeteria(this.data, date, type)
    }
    if (type === TYPE.TOMORROW)
      this.rmqtlr = await parseCafeteria(this.data, date + 1, type)
    if (type === TYPE.TARGET)
      this.rmqtlr = await parseCafeteria(this.data, value, type)
    if (type === TYPE.DAYKO)
      this.rmqtlr = await parseCafeteria(this.data, date, type, value)
    if (type === TYPE.THIS)
      this.rmqtlr = await parseCafeteria(this.data, date, type)
    if (type === TYPE.NEXT)
      this.rmqtlr = await parseCafeteria(this.data, date + 7, type)
    if (type === TYPE.ERROR) {
      this.options = null
      this.rmqtlr = { type }
    }

    return this.rmqtlr
  }
}
