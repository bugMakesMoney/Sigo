import { fbMessenger } from '../../lib'
import { Constants, PayloadTypes } from '../constants'

export default class eventPostback {
  private app: fbMessenger
  private userId: string
  private payload: string

  constructor(payload: string) {
    this.payload = payload
  }

  on = async (app: fbMessenger, userId: string) => {
    this.app = app
    this.userId = userId
    const { payload, helpSchedule, helpReport, helpStarted } = this
    if (payload === PayloadTypes.HELP_CAFETERIA)
      return await this.helpCafeteria()
    if (payload === PayloadTypes.HELP_SCHEDULE) return await helpSchedule()
    if (payload === PayloadTypes.HELP_REPORT) return await helpReport()
    if (payload === PayloadTypes.HELP_STARTED) return await helpStarted()
  }

  private helpStarted = async () => {
    const { app, userId } = this
    const { first_name } = await app.getUserProfile(userId)
    await app.sendTextMessage(
      userId,
      `안녕 ${first_name}!\n\n${Constants.SEND_STARTED}`
    )
  }

  private helpCafeteria = async () => {
    const { app, userId } = this
    await app.sendTextMessage(userId, Constants.SEND_HELP_CAFETERIA)
  }

  private helpSchedule = async () => {
    const { app, userId } = this
    await app.sendTextMessage(userId, Constants.SEND_HELP_SCHEDULE)
  }

  private helpReport = async () => {
    const { app, userId } = this
    await app.sendTextMessage(userId, Constants.SEND_HELP_REPORT)
  }
}
