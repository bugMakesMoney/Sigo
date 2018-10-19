import * as Express from 'express'
import { fbMessenger, EventTypes } from '../lib'
import Cafeteria from './modules/cafeteria'
import Schedule from './modules/schedule'
import { matchModule } from './utils/match'
import { MODULE, TYPE } from './constants/matchTypes'
import { sendCafeteria, sendOverlap, sendSchedule } from './bot'
const express = Express()

const { APP_SECRET, ACCESS_TOKEN, VERIFY_TOKEN } = process.env

// const config = {
//   appSecret: APP_SECRET,
//   accessToken: ACCESS_TOKEN,
//   verifyToken: VERIFY_TOKEN,
// }
const config = {
  appSecret: '3c7a370c9d826d3206d1c1559e97e83e',
  accessToken:
    'EAADXqsSmDEYBAPZCgUFSZASs5maoTbhi8O20xnRCS3iJaaQl1p7JHE1DJ5RIfO20UZAGzwi6sqisri0vTAtzKbAtjVJYWAVYZAPvaZC6gYq0qgMSrqkntYgsLAjLbQwcEHQUkJwVZC8puwOUWftQD32hbVI4FRa0tBnqqbH9Lo9gMGkR5suBvc',
  verifyToken: 'sigo',
}
const port = process.env.PORT || 8000

const server = require('http').Server(express)

const app = new fbMessenger(config, server)

express.use(app.setWebhook('/webhook'))

const cafeteria: Cafeteria = new Cafeteria()
const schedule: Schedule = new Schedule()
// schedule.getSchedule({ type: 'target', value: 10 })
app.subscribe(EventTypes.MESSAGE, async (userId, message) => {
  const firstTime = new Date().getTime()
  try {
    if (message.isText()) {
      const { module, options } = matchModule(message.getText())
      if (module === MODULE.CAFETERIA) {
        return await app.sendTextMessage(
          userId,
          sendCafeteria(cafeteria.getCafeteria(options))
        )
      }
      if (module === MODULE.SCHEDULE) {
        return await app.sendTextMessage(
          userId,
          sendSchedule(await schedule.getSchedule(options))
        )
      }
      if (module === MODULE.ECHO) {
        return await app.sendTextMessage(userId, message.getText())
      }
      if (options.type === TYPE.OVERLAP) {
        return await app.sendTextMessage(userId, sendOverlap(options))
      }
    }
  } catch (e) {
    console.log(e)
  } finally {
    const lastTime = new Date().getTime()
    console.log('log time : ', lastTime - firstTime)
  }
})

server.listen(port, () => {
  console.log('listen')
})
