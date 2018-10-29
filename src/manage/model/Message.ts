import { Document, Schema, model } from 'mongoose'

interface IMessage extends Document {
  index: number
  userId: string
  date: Date
  text?: string
  imageUrl?: string
  paylod?: string
}

const MessageSchema = new Schema({
  index: Number,
  userId: String,
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
    text,
    imageUrl,
    payload,
  }: {
    userId: string
    text?: string
    imageUrl?: string
    payload?: string
  }) => {
    return await MessageModel.create({
      userId,
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
