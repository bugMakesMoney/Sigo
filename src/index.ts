import * as Express from 'express'
import { fbMessenger, EventTypes } from '../lib'
import Cafeteria from './modules/cafeteria'
import { matchModule } from './utils/match'
import { moduleType } from './constants/matchTypes'
import { sendCafeteria } from './bot'
const express = Express()

const { APP_SECRET, ACCESS_TOKEN, VERIFY_TOKEN } = process.env

// const config = {
//   appSecret: APP_SECRET,
//   accessToken: ACCESS_TOKEN,
//   verifyToken: VERIFY_TOKEN,
// }
const config = {
  appSecret: '3c7a370c9d826d3206d1c1559e97e83e',
  accessToken:
    'EAADXqsSmDEYBAPZCgUFSZASs5maoTbhi8O20xnRCS3iJaaQl1p7JHE1DJ5RIfO20UZAGzwi6sqisri0vTAtzKbAtjVJYWAVYZAPvaZC6gYq0qgMSrqkntYgsLAjLbQwcEHQUkJwVZC8puwOUWftQD32hbVI4FRa0tBnqqbH9Lo9gMGkR5suBvc',
  verifyToken: 'sigo',
}
const port = process.env.PORT || 8000

const server = require('http').Server(express)

const app = new fbMessenger(config, server)

express.use(app.setWebhook('/webhook'))

const cafeteria: Cafeteria = new Cafeteria()

app.subscribe(EventTypes.MESSAGE, async (userId, message) => {
  try {
    if (message.isText()) {
      const { module, options } = matchModule(message.getText())
      // console.log(cafeteria.getCafeteria(options))
      if (module === moduleType.CAFETERIA) {
        return await app.sendTextMessage(
          userId,
          sendCafeteria(cafeteria.getCafeteria(options))
        )
      }
    }
  } catch (e) {
    console.log(e)
  }
})

server.listen(port, () => {
  console.log('listen')
})
