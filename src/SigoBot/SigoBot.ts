import { ConfigModel, AppConfigModel } from './model/ConfigModel'
import { appConfig } from './config/appConfig'
import { loadConfig } from './util/config'
import { clientConfig } from './config/clientConfig'

class SigoBot {
  app: appConfig
  client: clientConfig
  constructor(_config?: ConfigModel, _server?: any) {
    const config: ConfigModel = _config ? _config : loadConfig()
    this.app = new appConfig(config)
    this.client = new clientConfig(_server)
  }

  listen(port: number) {
    this.client.listen(port)
  }

  webhook(webhookUrl: string) {
    return this.client.setWebhook(webhookUrl)
  }
}

export = SigoBot
