import { MatchResultModel } from '../model/matchModel'
import { MODULE, Constants, TYPE } from '../constants'
import { fbMessenger, Cafeteria, Schedule } from '../types'
import bot from '../bot'
import { UserModel } from '../manage/model'
import db from '../manage/db'

export default class eventText {
  private matchResult: MatchResultModel
  private app: fbMessenger
  private userId: string

  constructor(matchResult: MatchResultModel) {
    this.matchResult = matchResult
  }

  on = async (
    app: fbMessenger,
    userId,
    cafeteria: Cafeteria,
    schedule: Schedule,
    text: string
  ) => {
    this.app = app
    this.userId = userId

    const {
      matchResult: { module, options },
    } = this
    const { type = null } = options || {}
    const { CAFETERIA, SCHEDULE, REPORT, ECHO } = MODULE
    const { OVERLAP } = TYPE
    if (module === CAFETERIA) return await this.moduleCafeteria(cafeteria)
    if (module === SCHEDULE) return await this.moduleSchedule(schedule)
    if (module === REPORT) return await this.moduleReport()
    if (module === ECHO) return await this.moduleEcho(text)
    if (type === OVERLAP) return await this.moduleOverlap(options)
  }

  moduleCafeteria = async cafeteria => {
    const {
      app,
      userId,
      matchResult: { options },
    } = this
    await app.sendTextMessage(
      userId,
      bot.sendCafeteria(cafeteria.getCafeteria(options))
    )
  }

  moduleSchedule = async schedule => {
    const {
      app,
      userId,
      matchResult: { options },
    } = this
    await app.sendTextMessage(
      userId,
      bot.sendSchedule(await schedule.getSchedule(options))
    )
  }

  moduleReport = async () => {
    const { app, userId } = this
    const { SORRY_COUNT_REPORT, PLZ_SEND_REPORT } = Constants
    const { reportCount = 0, lastReportDate = new Date() } =
      (await UserModel.findById(userId)) || {}
    const date = lastReportDate.getDate()

    if (date !== new Date().getDate()) {
      await UserModel.resetReportCount(userId)
    }

    if (reportCount > 2) {
      await app.sendTextMessage(userId, SORRY_COUNT_REPORT)
    } else {
      await app.sendTextMessage(userId, PLZ_SEND_REPORT)
      await db.hsetAsync(userId, 'isReport', true)
      await db.hsetAsync(userId, 'step', 'reportText')
    }
  }

  moduleEcho = async text => {
    const { app, userId } = this
    await app.sendTextMessage(userId, text)
  }

  moduleOverlap = async options => {
    const { app, userId } = this
    await app.sendTextMessage(userId, bot.sendOverlap(options))
  }
}
