import * as Express from 'express'
import { fbMessenger, EventTypes } from '../lib'
import Cafeteria from './module/cafeteria'
import { sendTodayRmqtlr, sendTomorrowRmqtlr } from './bot'
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
const cafeteria = new Cafeteria(
  'http://stu.sen.go.kr/sts_sci_md00_001.do?schulCode=B100000599&schulCrseScCode=4&schulKndScCode=04&schMmealScCode=2&schYm={targetDate}&'
)

app.subscribe(EventTypes.MESSAGE, async (userId, message) => {
  if (message.isText()) {
    if (message.getText() == '급식') {
      return await app.sendTextMessage(userId, await sendTodayRmqtlr(cafeteria))
    }
    if (message.getText() == '내일 급식') {
      return await app.sendTextMessage(
        userId,
        await sendTomorrowRmqtlr(cafeteria)
      )
    }
  }
})

server.listen(port, () => {
  console.log('listen')
})
