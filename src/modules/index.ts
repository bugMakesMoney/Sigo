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
      //    appSecret: APP_SECRET,
      //    accessToken: ACCESS_TOKEN,
      //    verifyToken: VERIFY_TOKEN,
      //    pageToken: PAGE_TOKEN,
      //    pageId: PAGE_ID
      appSecret: '3c7a370c9d826d3206d1c1559e97e83e',
      accessToken:
        'EAADXqsSmDEYBAPZCgUFSZASs5maoTbhi8O20xnRCS3iJaaQl1p7JHE1DJ5RIfO20UZAGzwi6sqisri0vTAtzKbAtjVJYWAVYZAPvaZC6gYq0qgMSrqkntYgsLAjLbQwcEHQUkJwVZC8puwOUWftQD32hbVI4FRa0tBnqqbH9Lo9gMGkR5suBvc',
      verifyToken: 'sigo',
      pageToken:
        'EAADXqsSmDEYBAK1hLBUOavg9bFMT785xfIvZB7ejjmbtUJrcWiFfdXiyiKa02z2NbIlWofGboLWDChiUHZB6SXNZBfRk1qZA7kbyrZCidYqeu6ryibYTFw4LZCCi1NZBF7AZAv6ED3ZBdxiy6ExejSRVj9Hlt37oXkgWvd1IZATnDTzUtace6rB7Tv',
      pageId: '325920784549338',
    }
  }

  init = () => {
    const express = Express()
    this.server = require('http').Server(express)

    const { config, server } = this

    const app = new fbMessenger(config, server)
    express.use(app.setWebhook('/webhook'))
    express.use('/', (req, res) => {
      console.log(res)
      res.end(200)
    })
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
