import dateTypes from '../constants/dateTypes'
import { CafeteriaModel } from '../model/cafeteriaModel'
import { TYPE } from '../constants/matchTypes'

export const parseCafeteria = (
  rmqtlr: Cheerio,
  index: number,
  type: string,
  targetIndex?: number
): CafeteriaModel => {
  const currentData = rmqtlr
    .find('div')
    .toArray()
    .find(
      ({ firstChild }) => firstChild && firstChild.data === index.toString()
    )

  if (type === TYPE.NEXT || type === TYPE.THIS) {
    return {
      type,
      data: parseWeekCafeteria(currentData),
    }
  }

  if (type === TYPE.DAYKO) {
    return {
      type,
      data: parseDayOfWeekCafeteria(currentData, targetIndex),
    }
  }

  if (type === TYPE.TARGET) {
    return {
      type,
      data: parseTargetCafeteria(currentData, index),
    }
  }

  return {
    type,
    data: parseDayCafeteria(currentData),
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
  return children
    .filter(({ children }) => children)
    .filter(({ children }, i) =>
      children.find(({ firstChild: { data } }) => {
        if (data === index.toString()) {
          targetIndex = i
          console.log(data, index, i)
          return true
        }
      })
    )
    .map(({ firstChild: { children } }, index) =>
      children
        .filter(({ data }) => data)
        .map(({ data }) => data)
        .filter((e, i, a) => e !== a[1])
        .map((e, i, arr) => {
          return i === 0
            ? arr.length > 1
              ? e + ` ${KoDayType(targetIndex)}요일 급식\n`
              : e +
                ` ${KoDayType(targetIndex)}요일 급식\n급식을 먹는날이 아닙니다`
            : e
        })
        .join('\n')
        .replace(/[0-9]*\./g, '')
    )
    .toString()
}

const parseWeekCafeteria = ({
  parent: {
    parent: { children },
  },
}: CheerioElement) => {
  return children
    .filter(({ children }) => children)
    .map(({ firstChild: { children } }, index) =>
      children
        .filter(({ data }) => data)
        .map(({ data }) => data)
        .filter((e, i, a) => e !== a[1])
        .map((e, i, arr) => {
          return i === 0
            ? arr.length > 1
              ? e + ` ${KoDayType(index)}요일 급식\n`
              : e + ` ${KoDayType(index)}요일 급식\n급식을 먹는날이 아닙니다`
            : e
        })
        .join('\n')
    )
    .slice(1, -1)
    .join('\n\n')
    .replace(/[0-9]*\./g, '')
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
    .filter((e, i, a) => e !== a[1])
    .map(({ data }, i, arr) => {
      return i === 0
        ? arr.length > 1
          ? data + `일 ${KoDayType(targetIndex + 1)}요일 급식\n`
          : data +
            `일 ${KoDayType(
              targetIndex + 1
            )}요일 급식\n\n급식을 먹는날이 아닙니다`
        : data
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

const KoDayType = index => {
  // return isNumber(index)
  return dateTypes.DayOfWeek[index % 7]
  // : dateTypes.DayOfWeek[Number(index) % 7]
}
