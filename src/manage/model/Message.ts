import { Document, Schema, model } from 'mongoose'

interface IMessage extends Document {
  index: number
  userId: string
  userName: string
  date: Date
  text?: string
  imageUrl?: string
  payload?: string
}

const MessageSchema = new Schema({
  index: Number,
  userId: String,
  userName: String,
  date: Date,
  text: String,
  imageUrl: String,
  payload: String,
})

const MessageModel = model<IMessage>('Message', MessageSchema)

export default class Message {
  static findById = async (userId: string): Promise<IMessage[]> => {
    return await MessageModel.find({ userId }).exec()
  }

  static saveMessage = async ({
    userId,
    userName,
    text,
    imageUrl,
    payload,
  }: {
    userId: string
    userName?: string
    text?: string
    imageUrl?: string
    payload?: string
  }) => {
    return await MessageModel.create({
      userId,
      userName,
      text,
      date: new Date(),
      imageUrl,
      payload,
    })
  }

  static removeAllMessages = async () => {
    return await MessageModel.deleteMany({})
  }
}
