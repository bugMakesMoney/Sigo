import { Constants, PayloadTypes } from '../constants'
import { fbMessenger } from '../types'
import db from '../manage/db'
import { Report } from '../modules'
import { ReplyMessage } from '../../lib'
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
    } = this
    const {
      REPLY_REPORT_YES,
      REPLY_REPORT_NO,
      REPLY_PICTURES_YES,
      REPLY_PICTURES_NO,
      REPLY_ANONYMOUS_YES,
      REPLY_ANONYMOUS_NO,
    } = PayloadTypes
    if (payload === REPLY_REPORT_YES) return await replyReportYes()
    if (payload === REPLY_REPORT_NO) return await replyReportNo()
    if (payload === REPLY_PICTURES_YES) return await replyPicturesYes()
    if (payload === REPLY_PICTURES_NO) return await replyPicturesNo()
    if (payload === REPLY_ANONYMOUS_YES) return await replyAnonymousYes()
    if (payload === REPLY_ANONYMOUS_NO) return await replyAnonymosNo()
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
    const replyIsConfirm = new ReplyMessage(Constants.REPLY_REPORT_CONFIRM)
    replyIsConfirm.addText('예', PayloadTypes.REPLY_REPORT_YES)
    replyIsConfirm.addText('아니요', PayloadTypes.REPLY_REPORT_NO)

    await db.hsetAsync(userId, 'isAnonymous', true)
    await app.sendReply(userId, replyIsConfirm.buildReply())
  }

  private replyAnonymosNo = async () => {
    const { app, userId } = this
    const replyIsConfirm = new ReplyMessage(Constants.REPLY_REPORT_CONFIRM)
    replyIsConfirm.addText('예', PayloadTypes.REPLY_REPORT_YES)
    replyIsConfirm.addText('아니요', PayloadTypes.REPLY_REPORT_NO)

    await db.hsetAsync(userId, 'isAnonymous', false)
    await app.sendReply(userId, replyIsConfirm.buildReply())
  }

  private replyReportYes = async () => {
    const { app, userId } = this
    const { name: userName } = await app.getUserProfile(userId)
    const { pageToken, version, endpoint } = app.getAppInfo()
    const { reportText, isAnonymous } = await db.hgetAllAsync(userId)
    const pictures = await db.lrangeAsync(userId + 'pic', 0, -1)
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
    const { result, id } = await report.postReport(reportText)
    if (result) {
      await app.sendTextMessage(userId, Constants.SEND_REPORT_SUCCESS)
      await app.sendTextMessage(
        userId,
        `익명 여부 : ${
          Boolean(isAnonymous) ? '예' : '아니요'
        }\n제보 글 : ${reportText}\n${pictures}`
      )
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
    await app.sendTextMessage(userId, Constants.SEND_REPORT_NO)
  }
}
