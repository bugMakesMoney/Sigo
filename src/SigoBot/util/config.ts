import * as dotenv from 'dotenv'
dotenv.config()

export const loadConfig = () => {
  const {
    APP_SECRET,
    ACCESS_TOKEN,
    VERIFY_TOKEN,
    PAGE_ID,
    PAGE_TOKEN,
  } = process.env
  return {
    appSecret: APP_SECRET,
    accessToken: ACCESS_TOKEN,
    verifyToken: VERIFY_TOKEN,
    pageId: PAGE_ID,
    pageToken: PAGE_TOKEN,
  }
}
