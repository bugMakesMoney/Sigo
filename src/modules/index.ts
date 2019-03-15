import * as request from 'request-promise'
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
  private app: fbMessenger

  constructor() {
    const { APP_SECRET, ACCESS_TOKEN, VERIFY_TOKEN } = process.env
    this.config = {
      appSecret: APP_SECRET,
      accessToken: ACCESS_TOKEN,
      verifyToken: VERIFY_TOKEN,
    }
  }

  init = (webhookUrl: string) => {
    const express = Express()
    this.server = require('http').Server(express)

    const { config, server } = this

    this.app = new fbMessenger(config, server)
    const { app } = this
    express.use(app.setWebhook(webhookUrl))
    express.get('/', (req, res) => {
      res.send('sigo facebook bot')
    })

    db.flushAll()

    this.addOn()
    return {
      app,
      cafeteria: new Cafeteria(),
      schedule: new Schedule(),
    }
  }

  addOn = async () => {
    const { app } = this
    const { endpoint, version, accessToken } = app.getAppInfo()
    const url = `${endpoint}/${version}/me/thread_settings`

    const greetingMessage = '안녕 {{user_first_name}}!'

    await this.addGreeting(url, accessToken, greetingMessage)
    await this.addStarted(url, accessToken)
    await this.addDefaultButton(url, accessToken)
  }

  private addGreeting = async (url: string, access_token: string, text) => {
    const options = {
      method: 'POST',
      url,
      qs: {
        access_token,
      },
      json: true,
      body: {
        setting_type: 'greeting',
        greeting: {
          text,
        },
      },
    }

    try {
      await request(options)
      console.info('add greeting')
    } catch (err) {
      console.log(err.message)
    }
  }

  private addStarted = async (url: string, access_token: string) => {
    const options = {
      method: 'POST',
      url,
      qs: {
        access_token,
      },
      json: true,
      body: {
        setting_type: 'call_to_actions',
        thread_state: 'new_thread',
        call_to_actions: [
          {
            payload: 'HELP_STARTED',
          },
        ],
      },
    }
    try {
      await request(options)
      console.info('add started')
    } catch (err) {
      console.log(err.message)
    }
  }

  private addDefaultButton = async (url: string, access_token: string) => {
    const options = {
      method: 'POST',
      url,
      qs: {
        access_token,
      },
      json: true,
      body: {
        setting_type: 'call_to_actions',
        thread_state: 'existing_thread',
        call_to_actions: [
          {
            type: 'postback',
            title: '급식',
            payload: 'HELP_CAFETERIA',
          },
          {
            type: 'postback',
            title: '일정',
            payload: 'HELP_SCHEDULE',
          },
          {
            type: 'postback',
            title: '제보',
            payload: 'HELP_REPORT',
          },
        ],
      },
    }
    try {
      await request(options)
      console.info('add default button')
    } catch (err) {
      console.log(err.message)
    }
  }

  listen = (port: number | string = 8000) => {
    const { server } = this

    server.listen(port, () => {
      console.info(`listen ${port}`)
    })
  }
}
