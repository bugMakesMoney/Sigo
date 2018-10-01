const express = require('express')()

const { FbM, EventTypes } = require('./lib')

const { APP_SECRET, ACCESS_TOKEN, VERIFY_TOKEN } = process.env

const config = {
  appSecret: APP_SECRET,
  accessToken: ACCESS_TOKEN,
  verifyToken: VERIFY_TOKEN,
}

const port = process.env.PORT || 8080

const server = require('http').Server(express)

const app = new FbM(config, server)

express.use(app.setWebhook('/webhook'))

app.subscribe(EventTypes.MESSAGE, async (userId, message) => {
  if (message.isText()) {
    console.log(message.getText())
    console.log(await app.sendTextMessage(userId, message.getText()))
  }
})

server.listen(port, () => {
  console.log('listen')
})
