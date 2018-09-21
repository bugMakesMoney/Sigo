const express = require('express')()

const SigoBot = require('./lib')

const config = {
  appSecret: '3c7a370c9d826d3206d1c1559e97e83e',
  accessToken:
    'EAADXqsSmDEYBAPZCgUFSZASs5maoTbhi8O20xnRCS3iJaaQl1p7JHE1DJ5RIfO20UZAGzwi6sqisri0vTAtzKbAtjVJYWAVYZAPvaZC6gYq0qgMSrqkntYgsLAjLbQwcEHQUkJwVZC8puwOUWftQD32hbVI4FRa0tBnqqbH9Lo9gMGkR5suBvc',
  verifyToken: 'sigo',
}

const port = process.env.PORT || 8080

const server = require('http').Server(express)

const app = new SigoBot(config, server)

express.use(app.webhook('/webhook'))

server.listen(port, () => {
  console.log('listen')
})
