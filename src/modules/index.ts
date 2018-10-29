import Cafeteria from './cafeteria'
import Schedule from './schedule'
import Report from './report'
import * as Express from 'express'
import { fbMessenger } from '../../lib'
import * as Http from 'http'
import db from '../manage/db'

export { Cafeteria, Schedule, Report }

export default class Initialize {
  private config
  private server: Http.Server

  constructor() {
    const {
      APP_SECRET,
      ACCESS_TOKEN,
      VERIFY_TOKEN,
      PAGE_TOKEN,
      PAGE_ID,
    } = process.env
    this.config = {
      appSecret: APP_SECRET,
      accessToken: ACCESS_TOKEN,
      verifyToken: VERIFY_TOKEN,
      pageToken: PAGE_TOKEN,
      pageId: PAGE_ID,
    }
  }

  init = (webhookUrl: string) => {
    const express = Express()
    this.server = require('http').Server(express)

    const { config, server } = this

    const app = new fbMessenger(config, server)
    express.use(app.setWebhook(webhookUrl))

    db.flushAll()
    return {
      app,
      cafeteria: new Cafeteria(),
      schedule: new Schedule(),
    }
  }

  listen = (port: number | string = process.env.PORT) => {
    const { server } = this

    server.listen(port, () => {
      console.info(`listen ${port}`)
    })
  }
}
