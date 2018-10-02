import { dayType } from '../constants/dateTypes'
import { RmqtlrModel } from '../model/cafeteriaModel'

export const parseDayRmqtlr = <T>(
  rmqtlr: Cheerio,
  curretDay: number
): RmqtlrModel<T> => {
  let result
  rmqtlr.find('td div').each((index, element) => {
    let day = element.firstChild && element.firstChild.data

    if (day == curretDay.toString()) {
      const data = element.children
        .splice(4, element.children.length)
        .map(element => {
          return element.data
        })
        .filter(element => Boolean(element))
        .join('\n')
        .replace(/[0-9]*\./g, '')
      result = {
        day: {
          index: day,
          ko: dayType[(index - 1) % 5],
        },
        data,
      }
      return false
    }
  })
  return result
}
