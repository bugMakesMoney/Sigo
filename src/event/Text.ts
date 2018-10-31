import { MatchResultModel } from '../model/matchModel'
import { MODULE, Constants, TYPE } from '../constants'
import { fbMessenger, Cafeteria, Schedule } from '../types'
import bot from '../bot'
import { UserModel } from '../manage/model'
import db from '../manage/db'
import { ReplyMessage } from '../../lib'

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
      adminMode,
      moduleCafeteria,
      moduleSchedule,
      moduleReport,
      moduleEcho,
      moduleOverlap,
    } = this
    const { type = null } = options || {}
    const { CAFETERIA, SCHEDULE, REPORT, ECHO } = MODULE
    const { OVERLAP } = TYPE
    if (text === Constants.ADMIN) return await adminMode()
    if (module === CAFETERIA) return await moduleCafeteria(cafeteria)
    if (module === SCHEDULE) return await moduleSchedule(schedule)
    if (module === REPORT) return await moduleReport()
    if (module === ECHO) return await moduleEcho(text)
    if (type === OVERLAP) return await moduleOverlap(options)
  }

  private adminMode = async () => {
    const { app, userId } = this
    await app.sendTextMessage(userId, Constants.PLZ_ADMIN_PW)
    await db.hsetAsync(userId, 'isAdminMode', true)
    await db.hsetAsync(userId, 'step', Constants.STEP_ADMIN_PW)
  }

  private moduleCafeteria = async cafeteria => {
    const {
      app,
      userId,
      matchResult: { options },
    } = this
    await app.sendTextMessage(
      userId,
      bot.sendCafeteria(await cafeteria.getCafeteria(options))
    )
  }

  private moduleSchedule = async schedule => {
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

  private moduleReport = async () => {
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

  private moduleEcho = async text => {
    const { app, userId } = this
    await app.sendTextMessage(userId, text)
  }

  private moduleOverlap = async options => {
    const { app, userId } = this
    await app.sendTextMessage(userId, bot.sendOverlap(options))
  }
}
