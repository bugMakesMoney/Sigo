import { EventTypes } from '../lib'
import { matchModule } from './utils/match'
import db from './manage/db'
import { Constants } from './constants'
import Initialize from './modules'
import { MessageType, PostbackType } from './types'
import { MessageModel, UserModel } from './manage/model'
import {
  EventReply,
  EventReport,
  EventText,
  EventAttachments,
  EventPostback,
} from './event'

const initialize = new Initialize()
const { app, cafeteria, schedule } = initialize.init('/webhook')

app.subscribe(EventTypes.MESSAGE, async (userId, message: MessageType) => {
  const firstTime = new Date().getTime()
  try {
    await app.sendTypingOn(userId)
    if (message.isReply()) {
      const payload = message.getPayload()
      const eventReply = new EventReply(payload)
      await eventReply.on(app, userId)
      return await MessageModel.saveMessage({ userId, payload })
    }

    const isReport = Boolean(await db.hgetAsync(userId, 'isReport'))
    if (isReport) {
      const step = await db.hgetAsync(userId, 'step')
      const eventReport = new EventReport(step)
      return await eventReport.on(app, userId, message)
    }

    if (message.isText()) {
      const text = message.getText()
      const eventText = new EventText(matchModule(text))
      await eventText.on(app, userId, cafeteria, schedule, text)
      return await MessageModel.saveMessage({ userId, text })
    }

    if (message.isAttachments()) {
      const eventAttachments = new EventAttachments(message)
      return await eventAttachments.on(app, userId)
    }
  } catch (e) {
    const isReport = Boolean(await db.hgetAsync(userId, 'isReport'))
    const { SEND_REPORT_CANCEL } = Constants
    if (isReport) {
      await app.sendTextMessage(userId, SEND_REPORT_CANCEL)
      await db.delAsync([userId, userId + 'pic'])
    }
    console.error('subscribe message error', e.message)
    app.sendTextMessage(userId, Constants.ERROR)
  } finally {
    const { name: userName, profile_pic, gender } = await app.getUserProfile(
      userId
    )
    await UserModel.saveUser({ userId, userName, profile_pic, gender })

    const lastTime = new Date().getTime()
    console.info('subscribe message time : ', lastTime - firstTime)
    return await app.sendTypingOff(userId)
  }
})

app.subscribe(
  EventTypes.POSTBACK,
  async (userId: string, postback: PostbackType) => {
    const firstTime = new Date().getTime()
    try {
      const payload = postback.getPostbackPayload()
      const eventPostback = new EventPostback(payload)
      await eventPostback.on(app, userId)
    } catch (e) {
      console.log('subscribe postback error', e.message)
      app.sendTextMessage(userId, Constants.ERROR)
    } finally {
      const { name: userName, profile_pic, gender } = await app.getUserProfile(
        userId
      )
      await UserModel.saveUser({ userId, userName, profile_pic, gender })

      const lastTime = new Date().getTime()
      console.info('subscribe postback time : ', lastTime - firstTime)
      return await app.sendTypingOff(userId)
    }
  }
)

const port = process.env.PORT
initialize.listen(port)
