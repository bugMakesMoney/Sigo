import * as request from 'request-promise'
import { ReportItemModel } from '../model'
import { ReportModel } from '../manage/model'

export default class report {
  userId: string
  userName: string
  isAnonymous: boolean
  reportText: string
  pictures?: string[]
  accessToken: string
  version: string
  endpoint: string
  constructor(reportInfo: ReportItemModel) {
    Object.entries(reportInfo).forEach(([key, value]) => {
      this[key] = value
    })
  }

  postReport = async reportText => {
    const {
      endpoint,
      version,
      accessToken: access_token,
      isAnonymous,
      userName,
    } = this
    const url = `${endpoint}/${version}/me/feed`
    const reportsCount = await ReportModel.getReportsCount()
    console.log(this.isAnonymous)
    const message = `#${reportsCount + 1}번째지잡생의외침\n
    ${isAnonymous ? '익명의 제보' : userName + '님의 제보'}\n
    ${reportText}`

    let options = {
      method: 'POST',
      url,
      qs: {
        access_token,
      },
      json: true,
      body: {
        message,
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
          body: Object.assign(options.body, {
            attached_media: pictureIds,
          }),
        })
      }
      const { id } = await request(options)

      return {
        result: true,
        id,
      }
    } catch (err) {
      console.log(err.message)
      return {
        result: false,
      }
    }
  }

  postPrivateImage = async imageUrl => {
    const { endpoint, version, accessToken: access_token } = this
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
