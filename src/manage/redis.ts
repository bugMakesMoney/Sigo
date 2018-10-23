import * as redis from 'redis'
import { promisify } from 'util'

const { REDIS_URL } = process.env
export const client = REDIS_URL
  ? redis.createClient(REDIS_URL)
  : redis.createClient(6379, '127.0.0.1')

client.on('error', err => {
  console.log('redis connect error', err)
})

export const getAsync = promisify(client.get).bind(client)
