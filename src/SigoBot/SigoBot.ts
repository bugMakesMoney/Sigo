import * as Http from 'http'

import { ConfigModel } from './model/ConfigModel'
import { appConfig } from './config/appConfig'
import { clientConfig } from './config/clientConfig'

class SigoBot {
  app: appConfig
  client: clientConfig

  constructor(_config: ConfigModel, _server?: Http.Server) {
    this.app = new appConfig(_config)
    this.client = new clientConfig(_config.verifyToken, _server)
  }

  listen(port: number) {
    this.client.listen(port)
  }

  webhook(webhookUrl: string) {
    return this.client.setWebhook(webhookUrl)
  }
}

export = SigoBot
