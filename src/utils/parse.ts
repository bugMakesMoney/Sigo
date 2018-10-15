import dateTypes from '../constants/dateTypes'
import { CafeteriaModel, DayCafeteriaModel } from '../model/cafeteriaModel'
import { TYPE } from '../constants/matchTypes'
import * as cheerio from 'cheerio'
import { isNumber } from 'util'

export const parseCafeteria = <T>(
  rmqtlr: Cheerio,
  index: number,
  type: string,
  targetIndex?: number
) => {
  const data = rmqtlr
    .find('div')
    .toArray()
    .find(({ firstChild: { data } }) => data === index.toString())
  if (type === TYPE.NEXT || type === TYPE.THIS) {
    return {
      date: {
        index,
        type,
      },
      data: parseWeekCafeteria(data),
    }
  }

  if (type === TYPE.DAYKO) {
    return {
      date: {
        index: index + (targetIndex - (index % 5)),
        type,
        ko: KoDayType(targetIndex + 1),
      },
      data: parseDayOfWeekCafeteria(data, targetIndex),
    }
  }
  return {
    date: {
      index,
      type,
      ko: KoDayType(index),
    },
    data: parseDayCafeteria(data),
  }
}

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
    .slice(4)
    .map(({ data }) => {
      return data
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

const parseWeekCafeteria = ({
  parent: {
    parent: { children },
  },
}: CheerioElement) => {
  return children
    .filter(({ children }) => children)
    .map(({ firstChild: { children } }) =>
      children
        .filter(({ data }) => data)
        .map(({ data }) => data)
        .filter((e, i, a) => e !== a[1])
        .map(
          (e, i, arr) =>
            i === 0
              ? arr.length > 1
                ? e + ` ${KoDayType(e)}요일 급식`
                : e + ` ${KoDayType(e)}요일 급식\n급식을 먹는날이 아닙니다`
              : e
        )
        .join('\n')
    )
    .slice(1, -1)
    .join('\n\n')
    .replace(/[0-9]*\./g, '')
}

const KoDayType = index => {
  // return isNumber(index)
  return dateTypes.DayOfWeek[index % 7]
  // : dateTypes.DayOfWeek[Number(index) % 7]
}
