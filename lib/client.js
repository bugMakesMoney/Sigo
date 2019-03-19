'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const Http = require('http')
const request = require('request-promise')
const config_1 = require('./constants/config')
const utils_1 = require('./utils')
class client {
  constructor(config, server) {
    this.subscribe = (eventType, listener) => {
      return this.server.on(eventType, listener)
    }
    this.setClientConfig = () => {
      return {
        webhook: config_1.WebhookUrl,
        endpoint: config_1.Endpoint,
        version: config_1.EndpointVersion,
      }
    }
    this.setWebhook = webhookUrl => {
      this.webhookUrl = webhookUrl
      return function(req, res, next) {
        const { path } = utils_1.parseUrl(req.url)
        if (path == this.webhookUrl) return
        next()
      }.bind(this)
    }
    this.handleGET = (res, query) => {
      query['']
      const verify_token = query['hub.verify_token']
      const mode = query['hub.mode']
      const challenge = query['hub.challenge']
      if (mode === 'subscribe' && verify_token === this.verifyToken) {
        res.writeHead(200)
        res.end(challenge)
        return
      }
      res.writeHead(403)
      if (verify_token) {
        console.warn(`${verify_token} is not verify token`)
        res.end(`${verify_token} is not verify token`)
      }
      res.end('verify token not found')
    }
    this.handlePOST = (req, res) => {
      req.setEncoding('utf-8')
      let data
      req.on('data', async chunk => {
        try {
          data = await JSON.parse(chunk)
          const { headers } = req
          const signature = headers['x-hub-signature']
          this.handleEvent(data, signature)
          res.statusCode = 200
          res.end('event received')
        } catch (e) {
          console.log('error', e.message)
          res.end(e.message)
        }
      })
    }
    this.handleEvent = (data, signature) => {
      utils_1.validationSignature(this.appSecret, signature)
      const event = utils_1.parseEvent(data)
      this.emitEvent(event.getEventType(), event.getSenderId(), event)
    }
    this.emitEvent = (eventType, id, message) => {
      this.server.emit(eventType, id, message)
    }
    this.requestCallback = (req, res) => {
      const { method } = req
      const { path, query } = utils_1.parseUrl(req.url)
      utils_1.isSame(path, this.webhookUrl)
        ? method === 'GET'
          ? this.handleGET(res, query)
          : method === 'POST'
          ? this.handlePOST(req, res)
          : ((res.statusCode = 403),
            console.warn(`${method} is not allowed method`),
            res.end(`${method} is not allowed method`))
        : ((res.statusCode = 403), console.warn(`${path} is not webhook url`))
    }
    this.listen = port => {
      if (!port) throw new Error('port number is not defined')
      this.server.listen(port, () => {
        console.log('listen', port)
      })
    }
    this.requestGet = url => {
      return this.sendRequest('GET', url)
    }
    this.requestPost = (url, body) => {
      const header = {
        'Content-Type': 'application/json; charset=utf-8',
      }
      return this.sendRequest('POST', url, header, body)
    }
    this.sendMessage = (recipientId, message) => {
      const url = `${this.endpoint}/${this.version}/me/messages`
      const messageData = {
        recipient: { id: recipientId },
        message: { text: message },
      }
      return this.requestPost(url, messageData)
    }
    this.sendAction = (recipientId, action) => {
      const url = `${this.endpoint}/${this.version}/me/messages`
      const actionData = {
        recipient: { id: recipientId },
        sender_action: action,
      }
      return this.requestPost(url, actionData)
    }
    this.sendAttachment = (recipientId, { type, payload_url, reusable }) => {
      const url = `${this.endpoint}/${this.version}/me/messages`
      const attachmentData = {
        recipient: { id: recipientId },
        message: {
          attachment: {
            type,
            payload: {
              url: payload_url,
              is_reusable: reusable,
            },
          },
        },
      }
      return this.requestPost(url, attachmentData)
    }
    this.sendQuickReply = (recipientId, { text, quick_replies }) => {
      const url = `${this.endpoint}/${this.version}/me/messages`
      const quickReplyData = {
        recipient: { id: recipientId },
        message: {
          text,
          quick_replies,
        },
      }
      return this.requestPost(url, quickReplyData)
    }
    this.createBroadcast = messages => {
      const url = `${this.endpoint}/${this.version}/me/message_creatives`
      const createBroadCastData = {
        messages,
      }
      return this.requestPost(url, createBroadCastData)
    }
    this.braodcast = broadCastData => {
      const url = `${this.endpoint}/${this.version}/me/broadcast_messages`
      return this.requestPost(url, broadCastData)
    }
    this.getUser = userId => {
      const url = `${
        this.endpoint
      }/${userId}?fields=name,first_name,profile_pic,gender&access_token=${
        this.accessToken
      }`
      return this.requestGet(url)
    }
    this.sendRequest = (method, url, header, body = {}) => {
      const options = {
        method,
        url,
        qs: {
          access_token: this.accessToken,
        },
        headers: header,
        json: true,
        body,
      }
      try {
        return request(options, (err, res, body) => {
          if (!err && res.statusCode == 200) {
            return {
              result: body,
              statusCode: res.statusCode,
            }
          } else {
            return {
              result: body.error,
              statusCode: res.statusCode,
            }
          }
        })
      } catch (e) {
        return {
          result: e.message,
          statusCode: 500,
        }
      }
    }
    utils_1.configKeyValidation(config)
    utils_1.configValueValidation(config)
    Object.entries(Object.assign({}, config, this.setClientConfig())).forEach(
      ([key, value]) => {
        this[key] = value
      }
    )
    this.server = server ? server : Http.createServer()
    this.server.on('request', this.requestCallback)
  }
  appInfo() {
    return {
      endpoint: this.endpoint,
      version: this.version,
      verifyToken: this.verifyToken,
      appSecret: this.appSecret,
      accessToken: this.accessToken,
    }
  }
}
exports.default = client
