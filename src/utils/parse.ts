import { dayType } from '../constants/dateTypes'
import { CafeteriaModel, DayCafeteriaModel } from '../model/cafeteriaModel'
import { moduleType } from '../constants/matchTypes'
import * as cheerio from 'cheerio'

export const parseCafeteria = <T>(
  rmqtlr: Cheerio,
  index: number,
  type: string
) => {
  const data = rmqtlr
    .find('div')
    .toArray()
    .find(({ firstChild: { data } }) => data === index.toString())
  if (type === moduleType.NEXT || type === moduleType.THIS) {
    return {
      date: {
        index,
        type,
      },
      data: parseWeekCafeteria(data),
    }
  } else {
    return {
      date: {
        index,
        type,
        ko: dayType[index % 7],
      },
      data: parseDayCafeteria(data),
    }
  }
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
    .filter(e => e.children)
    .map(({ firstChild: { children } }) =>
      children
        .filter(({ data }) => data)
        .map(({ data }) => data)
        .filter((e, i, a) => e !== a[1])
        .map(
          (e, i, arr) =>
            i === 0
              ? arr.length > 1
                ? e + ` ${dayType[parseInt(e) % 7]}요일 급식`
                : e +
                  ` ${
                    dayType[parseInt(e) % 7]
                  }요일 급식\n급식을 먹는날이 아닙니다`
              : e
        )
        .join('\n')
    )
    .slice(1, -1)
    .join('\n\n')
    .replace(/[0-9]*\./g, '')
}
