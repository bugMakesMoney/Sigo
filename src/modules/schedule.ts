import * as request from 'request-promise'
import * as cheerio from 'cheerio'

import base from './base'
import { scheduleUrl } from '../constants/url'
import { DateModel } from '../model'
import { TYPE } from '../constants/matchTypes'
import { parseSchedule } from '../utils/parse'

export default class schedule extends base {
  private _dlfwjd: any
  constructor(targetMonth?: number | string) {
    super()
    this.url = targetMonth
      ? scheduleUrl
          .replace('{year}', new Date().getFullYear().toString())
          .replace('{month}', targetMonth.toString())
      : scheduleUrl
    this.loadSchedule()
  }

  get dlfwjd() {
    return this._dlfwjd
  }

  set dlfwjd(dlfwjd) {
    this._dlfwjd = dlfwjd
  }

  private loadSchedule = async (date?: DateModel) => {
    let targetDate: string
    this.currentDate = this.reloadCurrentDate()
    const { year, month } = date || this.currentDate
    targetDate = year.toString() + month.toString()
    this.url = this.url
      .replace('{year}', year.toString())
      .replace('{month}', month.toString())
    try {
      const body = await request(this.url)
      const data = cheerio.load(body)
      this.data = data('tbody')
      console.log('load schedule data')
    } catch (err) {
      console.error('load schedule error', err)
      console.info('retry load schgedule')
      this.loadSchedule()
    }
  }

  public getSchedule = async (options?) => {
    let { month: _reloadMonth } = (this.currentDate = this.reloadCurrentDate())
    if (_reloadMonth !== this.currentDate.month) {
      console.log('month is changed. load new schedule')
      this.loadSchedule()
    }
    if (JSON.stringify(this.options) === JSON.stringify(options)) {
      console.log('same options')
      return this.dlfwjd
    }

    const { type, value } = (this.options = options)
    const { month } = this.currentDate

    if (type === TYPE.THIS)
      this.dlfwjd = await parseSchedule(this.data, month, type)
    if (type === TYPE.NEXT)
      this.dlfwjd = await parseSchedule(this.data, month + 1, type)
    if (type === TYPE.TARGET)
      this.dlfwjd = await parseSchedule(this.data, value, type)
    if (type === TYPE.ALL)
      this.dlfwjd = await parseSchedule(this.data, month, type)
    if (type === TYPE.ERROR) this.dlfwjd = { type }
    return this.dlfwjd
  }
}
