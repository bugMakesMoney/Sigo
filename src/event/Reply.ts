import { Constants, PayloadTypes } from '../constants'
import { fbMessenger } from '../types'
import db from '../manage/db'
import { Report } from '../modules'
import { ReplyMessage, Broadcast } from '../../lib'
import { UserModel, ReportModel } from '../manage/model'

export default class eventReply {
  private payload: string
  private app: fbMessenger
  private userId: string
  constructor(payload) {
    this.payload = payload
  }

  on = async (app, userId) => {
    this.app = app
    this.userId = userId
    const {
      payload,
      replyReportYes,
      replyReportNo,
      replyPicturesYes,
      replyPicturesNo,
      replyAnonymousYes,
      replyAnonymosNo,
      replyBroadcast,
      replyBroadcastYes,
      replyBroadcastNo,
      replyGreeting,
      replyGreetingYes,
      replyGreetingNo,
    } = this
    const {
      REPLY_REPORT_YES,
      REPLY_REPORT_NO,
      REPLY_PICTURES_YES,
      REPLY_PICTURES_NO,
      REPLY_ANONYMOUS_YES,
      REPLY_ANONYMOUS_NO,
      REPLY_BROADCAST,
      REPLY_BROADCAST_YES,
      REPLY_BROADCAST_NO,
      REPLY_GREETING,
      REPLY_GREETING_YES,
      REPLY_GREETING_NO,
    } = PayloadTypes
    if (payload === REPLY_REPORT_YES) return await replyReportYes()
    if (payload === REPLY_REPORT_NO) return await replyReportNo()
    if (payload === REPLY_PICTURES_YES) return await replyPicturesYes()
    if (payload === REPLY_PICTURES_NO) return await replyPicturesNo()
    if (payload === REPLY_ANONYMOUS_YES) return await replyAnonymousYes()
    if (payload === REPLY_ANONYMOUS_NO) return await replyAnonymosNo()
    if (payload === REPLY_BROADCAST) return await replyBroadcast()
    if (payload === REPLY_BROADCAST_YES) return await replyBroadcastYes()
    if (payload === REPLY_BROADCAST_NO) return await replyBroadcastNo()
    if (payload === REPLY_GREETING) return await replyGreeting()
    if (payload === REPLY_GREETING_YES) return await replyGreetingYes()
    if (payload === REPLY_GREETING_NO) return await replyGreetingNo()
  }

  private replyGreeting = async () => {
    const { app, userId } = this
    await db.hsetAsync(userId, 'step', Constants.STEP_CREATE_GREETING)
    await app.sendTextMessage(userId, Constants.SEND_GREETING_MESSAGE)
  }

  private replyGreetingYes = async () => {
    const { app, userId } = this
    const greetingMessage = await db.hgetAsync(userId, 'greetingMessage')

    const { message_creative_id } = await app.createDynamicBraodcast({
      text: greetingMessage,
      fallback_text: greetingMessage,
    })

    const broadcast = new Broadcast(
      message_creative_id,
      'REGULAR',
      'message_tag',
      'NON_PROMOTIONAL_SUBSCRIPTION'
    )
    await app.sendBraodcast(broadcast.buildBroadcast())
    await app.sendTextMessage(userId, Constants.SEND_GREETING)
    await app.sendTextMessage(userId, Constants.SEND_ADMIN_MODE_CANCEL)
    await db.delAsync([userId])
  }

  private replyGreetingNo = async () => {
    const { app, userId } = this
    await app.sendTextMessage(userId, Constants.SEND_GREETING_CANCEL)
    await app.sendTextMessage(userId, Constants.SEND_ADMIN_MODE_CANCEL)
    await db.delAsync([userId])
  }

  private replyBroadcast = async () => {
    const { app, userId } = this
    await db.hsetAsync(userId, 'step', Constants.STEP_CREATE_BROADCAST)
    await app.sendTextMessage(userId, Constants.SEND_BROADCAST_MESSAGE)
  }

  private replyBroadcastYes = async () => {
    const { app, userId } = this
    const broadCastMessage = await db.hgetAsync(userId, 'braodCastMessage')

    const { message_creative_id } = await app.createBroadcastMessage(
      broadCastMessage
    )

    const broadcast = new Broadcast(
      message_creative_id,
      'REGULAR',
      'message_tag',
      'NON_PROMOTIONAL_SUBSCRIPTION'
    )
    await app.sendBraodcast(broadcast.buildBroadcast())
    await app.sendTextMessage(userId, Constants.SEND_BROADCAST)
    await app.sendTextMessage(userId, Constants.SEND_ADMIN_MODE_CANCEL)
    await db.delAsync([userId])
  }

  private replyBroadcastNo = async () => {
    const { app, userId } = this
    await app.sendTextMessage(userId, Constants.SEND_BROADCAST_CANCEL)
    await app.sendTextMessage(userId, Constants.SEND_ADMIN_MODE_CANCEL)
    await db.delAsync([userId])
  }

  private replyPicturesYes = async () => {
    const { app, userId } = this
    await db.hsetAsync(userId, 'step', Constants.STEP_PICTURES)
    await app.sendTextMessage(userId, Constants.PLZ_SEND_PICTURES)
  }

  private replyPicturesNo = async () => {
    const { app, userId } = this
    const replyIsAnonymous = new ReplyMessage(Constants.REPLY_ISANONYMOUS)
    replyIsAnonymous.addText('예', PayloadTypes.REPLY_ANONYMOUS_YES)
    replyIsAnonymous.addText('아니요', PayloadTypes.REPLY_ANONYMOUS_NO)
    await app.sendReply(userId, replyIsAnonymous.buildReply())
  }

  private replyAnonymousYes = async () => {
    const { app, userId } = this
    const { reportText, isAnonymous } = await db.hgetAllAsync(userId)
    await app.sendTextMessage(
      userId,
      `${Constants.PLZ_CHECK_REPORT}\n\n익명여부 : O\n내용 : ${reportText}`
    )

    const replyIsConfirm = new ReplyMessage(Constants.REPLY_REPORT_CONFIRM)
    replyIsConfirm.addText('예', PayloadTypes.REPLY_REPORT_YES)
    replyIsConfirm.addText('아니요', PayloadTypes.REPLY_REPORT_NO)

    await db.hsetAsync(userId, 'isAnonymous', true)
    await app.sendReply(userId, replyIsConfirm.buildReply())
  }

  private replyAnonymosNo = async () => {
    const { app, userId } = this
    const { reportText, isAnonymous } = await db.hgetAllAsync(userId)
    await app.sendTextMessage(
      userId,
      `${Constants.PLZ_CHECK_REPORT}\n\n익명여부 : X\n내용 : ${reportText}`
    )

    const replyIsConfirm = new ReplyMessage(Constants.REPLY_REPORT_CONFIRM)
    replyIsConfirm.addText('예', PayloadTypes.REPLY_REPORT_YES)
    replyIsConfirm.addText('아니요', PayloadTypes.REPLY_REPORT_NO)

    await db.hsetAsync(userId, 'isAnonymous', false)
    await app.sendReply(userId, replyIsConfirm.buildReply())
  }

  private replyReportYes = async () => {
    const { app, userId } = this
    const { name: userName } = await app.getUserProfile(userId)
    const { accessToken, version, endpoint } = app.getAppInfo()
    const { reportText, isAnonymous } = await db.hgetAllAsync(userId)
    const pictures = await db.lrangeAsync(userId + 'pic', 0, -1)
    const report = new Report({
      userId,
      userName,
      isAnonymous,
      reportText,
      pictures,
      accessToken,
      version,
      endpoint,
    })
    const { result, id } = await report.postReport(reportText)
    if (result) {
      await app.sendTextMessage(userId, Constants.SEND_REPORT_SUCCESS)
      await app.sendTextMessage(
        userId,
        `작성한 게시글로 이동하기 : https://www.facebook.com/${id}`
      )
      await ReportModel.saveReport({
        userId,
        isAnonymous,
        reportText,
        pictures,
      })
      await UserModel.addReportCount(userId)
    } else {
      await app.sendTextMessage(userId, Constants.SEND_REPORT_FAIL)
    }
    await db.delAsync([userId, userId + 'pic'])
  }

  private replyReportNo = async () => {
    const { app, userId } = this
    await db.delAsync([userId, userId + 'pic'])
    await app.sendTextMessage(userId, Constants.SEND_REPORT_CANCEL)
  }
}
