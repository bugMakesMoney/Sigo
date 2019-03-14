import * as request from 'request-promise'
import * as cheerio from 'cheerio'

import dateTypes, { checkEndDay } from '../constants/dateTypes'
import { CafeteriaModel } from '../model'
import { TYPE } from '../constants/matchTypes'
import { scheduleUrl, cafeteriaUrl } from '../constants/url'

const loadNewSchedule = async index => {
  const targetUrl = scheduleUrl
    .replace('{year}', new Date().getFullYear().toString())
    .replace('{month}', index < 10 ? '0' + index.toString() : index.toString())
  try {
    const body = await request(targetUrl)
    const data = cheerio.load(body, {
      normalizeWhitespace: false,
      xmlMode: false,
      decodeEntities: true,
    })
    return data('tbody')
  } catch (err) {
    return err
  }
}

const commonParseSchedule = data => {
  try {
    return data
      .find('div')
      .toArray()
      .filter(({ children }) => children.some(({ name }) => name === 'a'))
      .map(({ children }) => children)
      .map(e =>
        e
          .filter(({ name }) => name === 'em' || name === 'a')
          .map(({ children }) =>
            children
              .filter(({ data, children }) => Number(data) || children)
              .map(({ data, children }) =>
                data ? `${data}일` : children.map(({ data }) => data).join('')
              )
              .join('')
          )
          .join('\n')
      )
      .join('\n\n')
  } catch (err) {
    console.error(err)
    return '일정이 없습니다'
  }
}

export const parseSchedule = async (
  dlfwjd: Cheerio,
  index: number,
  type: string
) => {
  if (type === TYPE.THIS) {
    return {
      type,
      data: `${index}월 일정\n\n${commonParseSchedule(dlfwjd)}`,
    }
  }
  if (type === TYPE.TARGET || type === TYPE.NEXT) {
    return {
      type,
      data: `${index}월 일정\n\n${commonParseSchedule(
        await loadNewSchedule(index)
      )}`,
    }
  }
  if (type === TYPE.ALL) {
    const allSchedules = dateTypes.Month.map(async month => {
      return `\n${month}월 일정\n\n${commonParseSchedule(
        await loadNewSchedule(month)
      )}`
    })
    return Promise.all(allSchedules).then(data => {
      return {
        type,
        data: data.join('\n'),
      }
    })
  }
}

export const parseCafeteria = async (
  rmqtlr: Cheerio,
  index: number,
  type: string,
  targetIndex?: number
) => {
  const currentData = rmqtlr
    .find('div')
    .toArray()
    .find(
      ({ firstChild }) => firstChild && firstChild.data === index.toString()
    )
  if (type === TYPE.NEXT || type === TYPE.THIS) {
    const month = new Date().getMonth() + 1
    const endDay = checkEndDay(month)
    if (type === TYPE.NEXT && endDay - 7 < index) {
      return {
        type,
        data: await parseWeekCafeteria(
          await loadNewCafeteria(month + 1, index - endDay)
        ),
      }
    }
    return {
      type,
      data: await parseWeekCafeteria(currentData),
    }
  }
  if (type === TYPE.DAYKO) {
    return {
      type,
      data: await parseDayOfWeekCafeteria(currentData, targetIndex),
    }
  }

  if (type === TYPE.TARGET) {
    return {
      type,
      data: await parseTargetCafeteria(currentData, index),
    }
  }

  const month = new Date().getMonth() + 1
  const endDay = checkEndDay(month)
  if (index > endDay) {
    return {
      type,
      data: await parseDayCafeteria(await loadNewCafeteria(month + 1, 1)),
    }
  }

  return {
    type,
    data: await parseDayCafeteria(currentData),
  }
}

const parseTargetCafeteria = (
  {
    parent: {
      parent: { children },
    },
  }: CheerioElement,
  index: number
) => {
  let targetIndex

  console.log(children)
  return children
    .filter(({ children }) => children)
    .filter(({ children }, i) =>
      children.find(({ firstChild: { data } }) => {
        if (data === index.toString()) {
          targetIndex = i
          return true
        }
      })
    )
    .map(({ firstChild: { children } }, index) => {
      return children
        .filter(({ data }) => data)
        .map(({ data }) => data)
        .filter((e, i, a) => e !== a[1])
        .map((e, i, { length }) => {
          if (i !== 0) return e
          return length > 1
            ? `${e} ${KoDayType(targetIndex)}요일 급식\n`
            : `${e} ${KoDayType(
                targetIndex
              )}요일 급식\n급식을 먹는날이 아닙니다`
        })
        .join('\n')
        .replace(/[0-9]*\./g, '')
    })
    .toString()
}

const loadNewCafeteria = async (month, index) => {
  const year = new Date().getFullYear()
  const targetDate = `${year}${month}`
  const url = cafeteriaUrl.replace(`{targetDate}`, targetDate)
  try {
    const body = await request(url)
    const data = cheerio.load(body, {
      decodeEntities: false,
      normalizeWhitespace: false,
    })('tbody')
    const newData = data
      .find('div')
      .toArray()
      .find(
        ({ firstChild }) => firstChild && firstChild.data === index.toString()
      )
    return newData
  } catch {}
}

const getNextCafeteria = async (month, count) => {
  try {
    return parseDayOfWeekCafeteria(await loadNewCafeteria(month, 1), count)
  } catch {}
}

const parseWeekCafeteria = ({
  parent: {
    parent: { children },
  },
}: CheerioElement) => {
  const month = new Date().getMonth() + 1
  let count = 0
  const promises = children
    .filter(({ children }) => children)
    .map(({ firstChild: { children } }, index) => {
      return children
        .filter(({ data }) => data)
        .map(({ data }) => data)
        .filter((e, i, a) => e !== a[1])
        .map((e, i, { length }) => {
          if (i !== 0) return e
          if (e.trim().length) {
            count++
            return length > 1
              ? `${e} ${KoDayType(index)}요일 급식\n`
              : `${e} ${KoDayType(index)}요일 급식\n급식을 먹는날이 아닙니다`
          }
          count++
          return getNextCafeteria(month + 1, count - 2)
        })
    })
    .reduce((prev, dataArray) => {
      if (dataArray.every(data => typeof data === 'string')) {
        return [...prev, dataArray.join('\n')]
      }
      return [...prev, ...dataArray]
    }, [])
  return Promise.all(promises).then(data => {
    return data
      .slice(1, -1)
      .join('\n\n')
      .replace(/[0-9]*\./g, '')
  })
}

// const parseWeekCafeteria = ({
//   parent: {
//     parent: { children: elWeekCafeteria },
//   },
// }: CheerioElement) => {
//   const month = new Date().getMonth() + 1
//   const endDay = checkEndDay(month)

//   const promises = elWeekCafeteria
//     .filter(({ firstChild: elDayCafeteria }) => elDayCafeteria)
//     .map(({ firstChild: elDayCafeteria }, dayIndex) => {
//       let dayData
//       elDayCafeteria.children
//         .filter(
//           ({ data: dayRowData }, rowIndex) => dayRowData && rowIndex !== 1
//         )
//         .forEach(({ data: dayRowData }, rowIndex, { length }) => {
//           const isHeader = rowIndex === 0
//           const text = dayRowData.trim()
//           if (isHeader) {
//             dayData = text
//               ? `${text} ${KoDayType(dayIndex)}요일 급식\n`
//               : getNextCafeteria(month, dayIndex - 2)
//             dayData += length === 1 ? '급식을 먹는날이 아닙니다' : ''
//           }
//           if (typeof dayData === 'string') {
//             dayData += '\n' + dayRowData
//           }
//         })
//       return dayData
//     })

//   return Promise.all(promises).then(data => {
//     console.log(data)
//     return data
//       .slice(1, -1)
//       .join('\n\n')
//       .replace(/[0-9]*\./g, '')
//   })
// }

const parseDayOfWeekCafeteria = (
  {
    parent: {
      parent: { children },
    },
  }: CheerioElement,
  targetIndex: number
) => {
  return children
    .filter(({ children }) => children)
    .slice(1, -1)
    [targetIndex].firstChild.children.filter(({ data }) => data)
    .filter((e, i, a) => e !== a[1])
    .map(({ data }, i, { length }) => {
      if (i !== 0) return data
      return length > 1
        ? `${data}일 ${KoDayType(targetIndex + 1)}요일 급식\n`
        : `${data}일 ${KoDayType(
            targetIndex + 1
          )}요일 급식\n\n급식을 먹는날이 아닙니다`
    })
    .join('\n')
    .replace(/[0-9]*\./g, '')
}

const parseDayCafeteria = ({ children }: CheerioElement) => {
  return children
    .slice(4)
    .map(({ data }) => data)
    .filter(element => Boolean(element))
    .join('\n')
    .replace(/[0-9]*\./g, '')
}

const KoDayType = index => dateTypes.DayOfWeek[index % 7]
