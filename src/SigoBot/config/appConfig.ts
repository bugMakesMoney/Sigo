import { AppConfigModel, ConfigModel } from '../model/ConfigModel'
import { configKeyValidation, configValueValidation } from '../util/validation'
import { WebhookUrl, Endpoint, EndpointVersion } from '../constants/config'

export class appConfig {
  private readonly appSecret: string
  private readonly accessToken: string
  private readonly verifyToken: string
  private readonly pageId?: string
  private readonly pageToken?: string
  private readonly webhook: string
  private readonly endpoint: string
  private readonly version: string
  constructor(_config: ConfigModel) {
    this.validation(_config)
    const defaultConfig = this.setDefaultValue()
    const config: AppConfigModel = Object.assign(_config, defaultConfig)
    Object.entries(config).forEach(([key, value]) => {
      this[key] = value
    })
  }

  private setDefaultValue() {
    return {
      webhook: WebhookUrl,
      endpoint: Endpoint,
      version: EndpointVersion,
    }
  }

  private validation(config: ConfigModel) {
    configKeyValidation(config)
    configValueValidation(config)
  }
}
