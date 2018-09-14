import { ConfigModel } from '../model/ConfigModel'
import { AppConfigKey, PageConfigKey } from '../constants/config'

export const configKeyValidation = (config: ConfigModel) => {
  const configKeys = Object.keys(config)
  if (!config) throw new Error('config is not defined')
  if (!configKeys.length) throw new Error('config is empty')
  const isPageInfo = Boolean(config.pageId || config.pageToken)
  const DefaultConfigKey = AppConfigKey.concat(isPageInfo ? PageConfigKey : [])
  return DefaultConfigKey.every(key => {
    if (!configKeys.includes(key)) throw new Error(`${key} is not defined`)
    return configKeys.includes(key)
  })
}

export const configValueValidation = (config: ConfigModel) => {
  return Object.entries(config).every(([key, value]) => {
    if (key === 'pageId') return typeCheck(key, value, 'number')
    return typeCheck(key, value, 'string')
  })
}

const typeCheck = (key: string, value: string | number, type: string) => {
  if (typeof value !== type) {
    throw new Error(`The value of ${key} must be ${type}, `)
  }
  return true
}
