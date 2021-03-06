import { fbMessenger, MessageType } from '../../lib'
import { MessageModel } from '../manage/model'
import { Constants } from '../constants'

export default class eventAttachments {
  private app: fbMessenger
  private userId: string
  private message: MessageType

  constructor(message: MessageType) {
    this.message = message
  }

  on = async (app: fbMessenger, userId: string) => {
    this.app = app
    this.userId = userId
    const { message, sendImage, sendDisallowFile } = this
    const attachments = message.getAttachments()
    return attachments.forEach(async attachment => {
      const {
        type,
        payload: { url: imageUrl },
      } = attachment
      if (type === 'image') return await sendImage(imageUrl)
      if (type !== 'image') return await sendDisallowFile()
    })
  }

  private sendImage = async (imageUrl: string) => {
    const { app, userId } = this
    await app.sendImageUrl(userId, imageUrl)
    await MessageModel.saveMessage({ userId, imageUrl })
  }

  private sendDisallowFile = async () => {
    const { app, userId } = this
    app.sendTextMessage(userId, Constants.SEND_DISALLOW_FILE)
  }
}
