import { parseUrl } from '../utils/parse'
import { isSame } from '../utils/util'
import * as Http from 'http'

export class clientConfig {
  server: Http.Server
  webhookUrl: string
  verifyToken: string
  constructor(_verifyToken: string, _server?: Http.Server) {
    this.verifyToken = _verifyToken
    if (_server) this.connectServer(_server)
    if (!_server) this.createServer()
  }

  createServer() {
    this.server = Http.createServer(this.requestCallback)
  }

  connectServer(_server: Http.Server) {
    this.server = _server
    this.server.on('request', this.requestCallback)
  }

  setWebhook(_webhookUrl: string) {
    this.webhookUrl = _webhookUrl
    return function(req, res, next) {
      const { path } = parseUrl(req.url)
      if (path == this.webhookUrl) return
      next()
    }.bind(this)
  }

  private requestGET(res: Http.ServerResponse, query) {
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
      res.end(`${verify_token} is not verify token`)
    }
    res.end('verify token not found')
  }
  private async requestPOST(req: Http.ServerRequest, res: Http.ServerResponse) {
    req.setEncoding('utf-8')
    let body
    await req.on('data', chunk => {
      body = JSON.parse(chunk)
    })
    const { object, entry } = body
    if (object === 'page') {
      entry.forEach(entry => {
        const webhook_event = entry.messaging[0]
        //handle webhook event
      })

      res.statusCode = 200
      res.end('event received')
    } else {
      res.statusCode = 404
      res.end()
    }
  }

  requestCallback = (req: Http.ServerRequest, res: Http.ServerResponse) => {
    const { method } = req
    const { path, query } = parseUrl(req.url)
    isSame(path, this.webhookUrl)
      ? method === 'GET'
        ? this.requestGET(res, query)
        : method === 'POST'
          ? this.requestPOST(req, res)
          : ((res.statusCode = 403), res.end(`${method} is not allowed method`))
      : ((res.statusCode = 403), res.end(`${path} is not webhook url`))
  }

  listen(port: number | string) {
    if (!port) throw new Error('port number is not defined')
    this.server.listen(port, () => {
      console.log('listen', port)
    })
  }
}
