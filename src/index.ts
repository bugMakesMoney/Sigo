import * as Express from 'express'
import { fbMessenger, EventTypes, MessageType, ReplyMessage } from '../lib'
import Cafeteria from './modules/cafeteria'
import Schedule from './modules/schedule'
import { matchModule } from './utils/match'
import { sendCafeteria, sendOverlap, sendSchedule } from './bot'
import { client, getAsync } from './manage/redis'
import { Constants, PayloadTypes, MODULE, TYPE } from './constants'
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
client.flushall()
app.subscribe(EventTypes.MESSAGE, async (userId, message: MessageType) => {
  const firstTime = new Date().getTime()
  try {
    await app.sendTypingOn(userId)
    const isReport = await getAsync(userId)
    if (message.isReply()) {
      const replyPaylod = message.getPayload()
      if (replyPaylod === PayloadTypes.REPLY_REPORT_YES) {
        client.del(userId)
        return await app.sendTextMessage(userId, Constants.REPORT_CONFIRM_YES)
      }
      if (replyPaylod === PayloadTypes.REPLY_REPORT_NO) {
        client.del(userId)
        return await app.sendTextMessage(userId, Constants.REPORT_CONFIRM_NO)
      }
    }
    if (message.isText()) {
      if (Boolean(isReport)) {
        const quick_replies = new ReplyMessage(Constants.REPORT_CONFIRM)
        quick_replies.addText('예', PayloadTypes.REPLY_REPORT_YES)
        quick_replies.addText('아니요', PayloadTypes.REPLY_REPORT_NO)
        return await app.sendReply(userId, quick_replies.makeMessage())
      }
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
      if (module === MODULE.REPORT) {
        await client.set(userId, 'true')
        return await app.sendTextMessage(userId, Constants.PLZ_WRITE_REPORT)
      }
      if (module === MODULE.ECHO) {
        return await app.sendTextMessage(userId, message.getText())
      }
      if (options.type === TYPE.OVERLAP) {
        return await app.sendTextMessage(userId, sendOverlap(options))
      }
    }

    if (message.isAttachments()) {
      const attachments = message.getAttachments()

      attachments.map(async attachment => {
        const {
          type,
          payload: { url },
        } = attachment
        if (type === 'image') await app.sendImageUrl(userId, url)
        if (type !== 'image') {
          await app.sendTextMessage(userId, Constants.DISALLOW_FILE)
        }
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
