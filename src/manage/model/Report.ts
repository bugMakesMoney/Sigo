import { Document, Schema, model } from 'mongoose'

interface IReport extends Document {
  userId: string
  isAnonymous: Boolean
  reportText: string
  date: Date
  pictures?: [String]
}

const ReportSchema = new Schema({
  userId: String,
  isAnonymous: Boolean,
  reportText: String,
  date: Date,
  pictures: [String],
})

const ReportModel = model<IReport>('Report', ReportSchema)

export default class Report {
  static findById = async (userId: string): Promise<IReport[]> => {
    return await ReportModel.find({ userId }).exec()
  }

  static findByAnonymous = async (isAnonymous: boolean): Promise<IReport[]> => {
    return await ReportModel.find({ isAnonymous }).exec()
  }

  static getReportsCount = async () => {
    return await ReportModel.find().count()
  }

  static saveReport = async ({
    userId,
    isAnonymous,
    reportText,
    pictures,
  }: {
    userId: string
    isAnonymous: boolean
    reportText: string
    pictures?: string[]
  }) => {
    return await ReportModel.create({
      userId,
      isAnonymous,
      reportText,
      date: new Date(),
      pictures,
    })
  }

  static removeAllReports = async () => {
    return await ReportModel.deleteMany({})
  }
}
