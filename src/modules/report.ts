import * as request from 'request-promise'
import { ReportItemModel } from '../model/reportModel'

export default class report {
  userId: string
  userName: string
  isAnonymous: boolean
  reportText: string
  pictures?: string[]
  pageToken: string
  version: string
  endpoint: string
  constructor(reportInfo: ReportItemModel) {
    Object.entries(reportInfo).forEach(([key, value]) => {
      this[key] = value
    })
  }

  postReport = async reportText => {
    const { endpoint, version, pageToken: access_token } = this
    const url = `${endpoint}/${version}/me/feed`

    let options = {
      method: 'POST',
      url,
      qs: {
        access_token,
      },
      json: true,
      body: {
        message: reportText,
      },
    }
    try {
      if (this.pictures.length) {
        const pictureIds = await Promise.all(
          this.pictures.map(async imageUrl => {
            const pictureId = await this.postPrivateImage(imageUrl)
            return {
              media_fbid: pictureId,
            }
          })
        )
        options = Object.assign(options, {
          body: Object.assign({
            message: reportText,
            attached_media: pictureIds,
          }),
        })
      }
      const result = await request(options)
      console.log(result)
    } catch (err) {
      console.log(err.message)
    }
  }

  postPrivateImage = async imageUrl => {
    const { endpoint, version, pageToken: access_token } = this
    const url = `${endpoint}/${version}/me/photos`
    const options = {
      method: 'POST',
      url,
      qs: {
        access_token,
      },
      body: {
        url: imageUrl,
        published: false,
      },
      json: true,
    }
    try {
      const { id } = await request(options)
      return id
    } catch (err) {
      console.log(err.message)
    }
  }
}
