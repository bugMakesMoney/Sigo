import { Document, Schema, model } from 'mongoose'

interface IReport extends Document {
  userId: string
  isAnonymous: Boolean
  text: string
  date: Date
  pictures?: [String]
}

const ReportSchema = new Schema({
  userId: String,
  isAnonymous: Boolean,
  text: String,
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

  static saveReport = async ({
    userId,
    isAnonymous,
    text,
    pictures,
  }: {
    userId: string
    isAnonymous: boolean
    text: string
    pictures?: string[]
  }) => {
    return await ReportModel.create({
      userId,
      isAnonymous,
      text,
      date: new Date(),
      pictures,
    })
  }
}
