import { fbMessenger, MessageType } from '../types'
import { Constants, PayloadTypes } from '../constants'
import db from '../manage/db'
import { ReplyMessage } from '../../lib'

export default class eventAdmin {
  private app: fbMessenger
  private userId: string
  private step: string

  constructor(step) {
    this.step = step
  }

  on = async (app: fbMessenger, userId: string, text: string) => {
    this.app = app
    this.userId = userId
    const {
      step,
      cancel,
      stepAdminPw,
      stepCreateBroadcast,
      stepCreateGreeting,
    } = this
    const {
      STEP_ADMIN_PW,
      STEP_CREATE_BROADCAST,
      CANCEL,
      STEP_CREATE_GREETING,
    } = Constants
    if (text === CANCEL) return await cancel()
    if (step === STEP_ADMIN_PW) return await stepAdminPw(text)
    if (step === STEP_CREATE_BROADCAST) return await stepCreateBroadcast(text)
    if (step === STEP_CREATE_GREETING) return await stepCreateGreeting(text)
  }

  private stepCreateGreeting = async text => {
    const { app, userId } = this
    const replyBraodcast = new ReplyMessage(Constants.SEND_GREETING_CONFIRM)
    replyBraodcast.addText('예', PayloadTypes.REPLY_GREETING_YES)
    replyBraodcast.addText('아니요', PayloadTypes.REPLY_GREETING_NO)
    await db.hsetAsync(userId, 'greetingMessage', text)
    await app.sendReply(userId, replyBraodcast.buildReply())
  }

  private stepCreateBroadcast = async text => {
    const { app, userId } = this
    const replyBraodcast = new ReplyMessage(Constants.SEND_BROADCAST_CONFIRM)
    replyBraodcast.addText('예', PayloadTypes.REPLY_BROADCAST_YES)
    replyBraodcast.addText('아니요', PayloadTypes.REPLY_BROADCAST_NO)
    await db.hsetAsync(userId, 'braodCastMessage', text)
    await app.sendReply(userId, replyBraodcast.buildReply())
  }

  private cancel = async () => {
    const { app, userId } = this
    await db.delAsync([userId])
    await app.sendTextMessage(userId, Constants.SEND_ADMIN_MODE_CANCEL)
  }

  private stepAdminPw = async text => {
    const { app, userId } = this
    const adminPw = process.env.ADMIN_PW || '5959'
    if (text === adminPw) {
      const replyAdminMode = new ReplyMessage(Constants.SEND_IS_ADMIN)
      replyAdminMode.addText('단체 메세지', PayloadTypes.REPLY_BROADCAST)
      replyAdminMode.addText('인사', PayloadTypes.REPLY_GREETING)
      await db.hsetAsync(userId, 'step', Constants.STEP_ADMIN_MODE)
      await app.sendReply(userId, replyAdminMode.buildReply())
    } else {
      await app.sendTextMessage(userId, Constants.SEND_NOT_ADMIN_PW)
    }
  }
}
