import * as Express from 'express'
import { fbMessenger, EventTypes, MessageType, ReplyMessage } from '../lib'
import Cafeteria from './modules/cafeteria'
import Schedule from './modules/schedule'
import Report from './modules/report'
import { matchModule } from './utils/match'
import { sendCafeteria, sendOverlap, sendSchedule } from './bot'
import {
  client,
  hsetAsync,
  hgetAsync,
  hgetAllAsync,
  lpushAsync,
  lrangeAsync,
} from './manage/db'
import { Constants, PayloadTypes, MODULE, TYPE } from './constants'
import MessageModel from './manage/model/Message'
import UserModel from './manage/model/User'

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
  pageToken:
    'EAADXqsSmDEYBAK1hLBUOavg9bFMT785xfIvZB7ejjmbtUJrcWiFfdXiyiKa02z2NbIlWofGboLWDChiUHZB6SXNZBfRk1qZA7kbyrZCidYqeu6ryibYTFw4LZCCi1NZBF7AZAv6ED3ZBdxiy6ExejSRVj9Hlt37oXkgWvd1IZATnDTzUtace6rB7Tv',
  pageId: '325920784549338',
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
    if (message.isReply()) {
      const payload = message.getPayload()
      if (payload === PayloadTypes.REPLY_REPORT_YES) {
        await app.sendTextMessage(userId, Constants.REPORT_CONFIRM_YES)
        const { reportText, isAnonymous } = await hgetAllAsync(userId)
        const { name: userName } = await app.getUserProfile(userId)
        const pictures = await lrangeAsync(userId + 'pic', 0, -1)
        const { pageToken, version, endpoint } = app.getAppInfo()
        const report = new Report({
          userId,
          userName,
          isAnonymous,
          reportText,
          pictures,
          pageToken,
          version,
          endpoint,
        })
        report.postReport(reportText)
        await app.sendTextMessage(
          userId,
          `제보 테스트 ${reportText}\n${isAnonymous}\n${pictures}`
        )
        await client.del([userId, userId + 'pic'])
        // await Report.saveReport({ userId, isAnonymous, text, pictures })
        // await UserModel.addReportCount({ userId })
      }
      if (payload === PayloadTypes.REPLY_REPORT_NO) {
        await client.del([userId, userId + 'pic'])
        await app.sendTextMessage(userId, Constants.REPORT_CONFIRM_NO)
      }
      if (payload === PayloadTypes.REPLY_PICTURES_YES) {
        await hsetAsync(userId, 'step', Constants.STEP_PICTURES)
        await app.sendTextMessage(userId, Constants.PLZ_SEND_PICTURES)
      }
      if (payload === PayloadTypes.REPLY_PICTURES_NO) {
        const replyIsAnonymous = new ReplyMessage(Constants.REPLY_ISANONYMOUS)
        replyIsAnonymous.addText('예', PayloadTypes.REPLY_ANONYMOUS_YES)
        replyIsAnonymous.addText('아니요', PayloadTypes.REPLY_ANONYMOUS_NO)
        await app.sendReply(userId, replyIsAnonymous.buildReply())
      }
      if (payload === PayloadTypes.REPLY_ANONYMOUS_YES) {
        await hsetAsync(userId, 'isAnonymous', true)
        const replyIsConfirm = new ReplyMessage(Constants.REPLY_REPORT_CONFIRM)
        replyIsConfirm.addText('예', PayloadTypes.REPLY_REPORT_YES)
        replyIsConfirm.addText('아니요', PayloadTypes.REPLY_REPORT_NO)
        await app.sendReply(userId, replyIsConfirm.buildReply())
      }
      if (payload === PayloadTypes.REPLY_ANONYMOUS_NO) {
        await hsetAsync(userId, 'isAnonymous', false)
        const replyIsConfirm = new ReplyMessage(Constants.REPLY_REPORT_CONFIRM)
        replyIsConfirm.addText('예', PayloadTypes.REPLY_REPORT_YES)
        replyIsConfirm.addText('아니요', PayloadTypes.REPLY_REPORT_NO)
        await app.sendReply(userId, replyIsConfirm.buildReply())
      }
      return await MessageModel.saveMessage({ userId, payload })
    }

    const isReport = Boolean(await hgetAsync(userId, 'isReport'))
    if (isReport) {
      const step = await hgetAsync(userId, 'step')
      try {
        if (step === Constants.STEP_DONE) {
          await app.sendTextMessage(userId, Constants.REPORT_CANCEL)
          return await client.del([userId, userId + 'pic'])
        }
        if (step === Constants.STEP_REPORT_TEXT) {
          const text = message.getText()
          await hsetAsync(userId, 'reportText', text)
          const replyIsPictures = new ReplyMessage(Constants.REPLY_ISPICTURES)
          replyIsPictures.addText('예', PayloadTypes.REPLY_PICTURES_YES)
          replyIsPictures.addText('아니요', PayloadTypes.REPLY_PICTURES_NO)
          await hsetAsync(userId, 'step', Constants.STEP_DONE)
          await app.sendReply(userId, replyIsPictures.buildReply())
          return await MessageModel.saveMessage({ userId, text })
        }
        if (step === Constants.STEP_PICTURES) {
          const attachments = message.getAttachments()
          attachments.forEach(async attachment => {
            const {
              type,
              payload: { url: imageUrl },
            } = attachment
            await lpushAsync(userId + 'pic', imageUrl)
            await MessageModel.saveMessage({ userId, imageUrl })
          })
          const replyIsAnonymous = new ReplyMessage(Constants.REPLY_ISANONYMOUS)
          replyIsAnonymous.addText('예', PayloadTypes.REPLY_ANONYMOUS_YES)
          replyIsAnonymous.addText('아니요', PayloadTypes.REPLY_ANONYMOUS_NO)
          await hsetAsync(userId, 'step', Constants.STEP_DONE)
          return await app.sendReply(userId, replyIsAnonymous.buildReply())
        }
      } catch {
        await app.sendTextMessage(userId, Constants.REPORT_CANCEL)
        return await client.del([userId, userId + 'pic'])
      }
    }

    if (message.isText()) {
      const text = message.getText()

      const { module, options } = matchModule(text)
      if (module === MODULE.CAFETERIA) {
        await app.sendTextMessage(
          userId,
          sendCafeteria(cafeteria.getCafeteria(options))
        )
      }
      if (module === MODULE.SCHEDULE) {
        await app.sendTextMessage(
          userId,
          sendSchedule(await schedule.getSchedule(options))
        )
      }
      if (module === MODULE.REPORT) {
        await app.sendTextMessage(userId, Constants.PLZ_SEND_REPORT)
        await hsetAsync(userId, 'isReport', true)
        await hsetAsync(userId, 'step', 'reportText')
      }
      if (module === MODULE.ECHO) {
        await app.sendTextMessage(userId, text)
      }
      if (options && options.type === TYPE.OVERLAP) {
        await app.sendTextMessage(userId, sendOverlap(options))
      }
      return await MessageModel.saveMessage({ userId, text })
    }

    if (message.isAttachments()) {
      const attachments = message.getAttachments()
      return attachments.forEach(async attachment => {
        const {
          type,
          payload: { url: imageUrl },
        } = attachment
        if (type === 'image') {
          await app.sendImageUrl(userId, imageUrl)
          await MessageModel.saveMessage({ userId, imageUrl })
        }
        if (type !== 'image') {
          await app.sendTextMessage(userId, Constants.DISALLOW_FILE)
        }
      })
    }
  } catch (e) {
    console.error('subscribe error', e)
  } finally {
    const { name: userName, profile_pic, gender } = await app.getUserProfile(
      userId
    )
    await UserModel.saveUser({ userId, userName, profile_pic, gender })
    const lastTime = new Date().getTime()
    console.info('log time : ', lastTime - firstTime)
    return await app.sendTypingOff(userId)
  }
})

server.listen(port, () => {
  console.info('listen')
})
