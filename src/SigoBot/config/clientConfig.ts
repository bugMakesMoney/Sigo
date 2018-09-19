import { parseUrl } from '../util/parse'

export class clientConfig {
  server: any
  webhookUrl: string
  constructor(_server?: any) {
    if (_server) this.connectServer(_server)
  }

  connectServer(_server) {
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

  private requestGET(req, res) {
    const { path } = parseUrl(req.url)
    if (path == this.webhookUrl) {
      res.end('asdf')
      return
    }
  }
  requestCallback = (req, res) => {
    const { method } = req
    if (method === 'GET') this.requestGET(req, res)
    if (method === 'POST') this.requestPOST(req, res)
  }
  private requestPOST(req, res) {}

  listen(port: number) {
    this.server.listen(port, () => {
      console.log('listen', port)
    })
  }
}
