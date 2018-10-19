import * as Express from 'express'
import { fbMessenger, EventTypes, Message } from '../lib'
import Cafeteria from './modules/cafeteria'
import Schedule from './modules/schedule'
import { matchModule } from './utils/match'
import { MODULE, TYPE } from './constants/matchTypes'
import { sendCafeteria, sendOverlap, sendSchedule } from './bot'

const express = Express()

const { APP_SECRET, ACCESS_TOKEN, VERIFY_TOKEN } = process.env

const config = {
  appSecret: APP_SECRET,
  accessToken: ACCESS_TOKEN,
  verifyToken: VERIFY_TOKEN,
}

const port = process.env.PORT || 8000

const server = require('http').Server(express)

const app = new fbMessenger(config, server)

express.use(app.setWebhook('/webhook'))

const cafeteria: Cafeteria = new Cafeteria()
const schedule: Schedule = new Schedule()

app.subscribe(EventTypes.MESSAGE, async (userId, message: Message) => {
  const firstTime = new Date().getTime()
  try {
    await app.sendTypingOn(userId)
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
    if (message.isReply()) {
      console.log('is reply', message.getPayload())
    }
    if (message.isAttachments()) {
      const attachments = message.getAttachments()

      attachments.map(async attachment => {
        const {
          payload: { url },
        } = attachment
        await app.sendImageUrl(userId, url)
      })
    }
  } catch (e) {
    console.log('subscribe error', e)
  } finally {
    const lastTime = new Date().getTime()
    console.log('log time : ', lastTime - firstTime)
    return await app.sendTypingOff(userId)
  }
})

server.listen(port, () => {
  console.log('listen')
})
