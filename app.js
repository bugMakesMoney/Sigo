const express = require('express')()

const SigoBot = require('./lib')
// require('dotenv').config()

const { APP_SECRET, ACCESS_TOKEN, VERIFY_TOKEN } = process.env

const config = {
  appSecret: APP_SECRET,
  accessToken: ACCESS_TOKEN,
  verifyToken: VERIFY_TOKEN,
}

const port = process.env.PORT || 8080

const server = require('http').Server(express)

const app = new SigoBot(config, server)

express.use(app.webhook('/webhook'))

server.listen(port, () => {
  console.log('listen')
})
