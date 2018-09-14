import { ConfigModel, AppConfigModel } from './SigoBot/model/ConfigModel'
import { appConfig } from './SigoBot/config/appConfig'

export class SigoBot {
  constructor(config?: ConfigModel) {
    const app = new appConfig(config)
  }
}
