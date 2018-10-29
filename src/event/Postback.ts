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
    const { payload } = this
    if (payload === PayloadTypes.HELP_CAFETERIA)
      return await this.helpCafeteria()
    if (payload === PayloadTypes.HELP_SCHEDULE) return await this.helpSchedule()
    if (payload === PayloadTypes.HELP_REPORT) return await this.helpReport()
  }

  helpCafeteria = async () => {
    const { app, userId } = this
    await app.sendTextMessage(userId, Constants.SEND_HELP_CAFETERIA)
  }

  helpSchedule = async () => {
    const { app, userId } = this
    await app.sendTextMessage(userId, Constants.SEND_HELP_SCHEDULE)
  }

  helpReport = async () => {
    const { app, userId } = this
    await app.sendTextMessage(userId, Constants.SEND_HELP_REPORT)
  }
}
