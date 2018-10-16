import * as Express from 'express'
import { fbMessenger, EventTypes } from '../lib'
import Cafeteria from './modules/cafeteria'
import { matchModule } from './utils/match'
import { MODULE, TYPE } from './constants/matchTypes'
import { sendCafeteria, sendOverlap } from './bot'
const express = Express()

const { APP_SECRET, ACCESS_TOKEN, VERIFY_TOKEN } = process.env

const config = {
  appSecret: APP_SECRET,
  accessToken: ACCESS_TOKEN,
  verifyToken: VERIFY_TOKEN,
}

const port = process.env.PORT || 8000

const server = require('http').Server(express)

const app = new fbMessenger(config, server)

express.use(app.setWebhook('/webhook'))

const cafeteria: Cafeteria = new Cafeteria()

app.subscribe(EventTypes.MESSAGE, async (userId, message) => {
  const firstTime = new Date().getTime()
  try {
    if (message.isText()) {
      const { module, options } = matchModule(message.getText())
      // console.log(cafeteria.getCafeteria(options))
      if (module === MODULE.CAFETERIA) {
        return await app.sendTextMessage(
          userId,
          sendCafeteria(cafeteria.getCafeteria(options))
        )
      }
      if (module === MODULE.SCHEDULE) {
        console.log(module, options)
      }
      if (module === MODULE.ECHO) {
        return await app.sendTextMessage(userId, message.getText())
      }
      if (options.type === TYPE.OVERLAP) {
        sendOverlap(module, options)
      }
    }
  } catch (e) {
    console.log(e)
  } finally {
    const lastTime = new Date().getTime()
    console.log('log time : ', lastTime - firstTime)
  }
})

server.listen(port, () => {
  console.log('listen')
})
