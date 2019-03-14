import * as redis from 'redis'
import * as mongoose from 'mongoose'
import { promisify } from 'util'

const { REDIS_URL, MONGODB_URI } = process.env

export const client = REDIS_URL
  ? redis.createClient(REDIS_URL)
  : redis.createClient(6379, '127.0.0.1')

client.on('error', err => {
  console.error('redis connect error', err)
})
client.once('open', () => {
  console.log('connected to redis server')
})

const db = mongoose.connection
db.on('error', err => {
  console.error('mongo connect error', err)
})
db.once('open', () => {
  console.log('connected to mongo server')
})

mongoose.connect(MONGODB_URI ? MONGODB_URI : 'mongodb://localhost/sigo', {
  useNewUrlParser: true,
})

const flushAll = promisify(client.flushall).bind(client)
const hgetAsync = promisify(client.hget).bind(client)
const hsetAsync = promisify(client.hset).bind(client)
const hgetAllAsync = promisify(client.hgetall).bind(client)
const lpushAsync = promisify(client.lpush).bind(client)
const lrangeAsync = promisify(client.lrange).bind(client)
const delAsync = promisify(client.del).bind(client)

export default {
  hgetAllAsync,
  hgetAsync,
  hsetAsync,
  lpushAsync,
  lrangeAsync,
  delAsync,
  flushAll,
}
