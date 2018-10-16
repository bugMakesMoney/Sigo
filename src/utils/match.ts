import * as Fuse from 'fuse.js'
import {
  matchType,
  cafeteriaMatch,
  TYPE,
  MODULE,
  scheduleMatch,
  dayOfWeekMatch,
} from '../constants/matchTypes'
import { MatchResultModel } from '../model/matchModel'
import { MatchCafeteriaModel } from '../model/cafeteriaModel'

const options = {
  keys: ['values'],
  threshold: 1,
  includeMatches: true,
  includeScore: true,
}

const matchCafeteria = (text: string): MatchCafeteriaModel => {
  const { item: { title: type = 'today' } = {} } =
    matchText(cafeteriaMatch, options, text)[0] || ({} as MatchResultModel)
  let value
  if (type === TYPE.TARGET) {
    text = text.replace(/[^0-9]/g, '')
    try {
      const [
        {
          matches: [{ value: resultValue }],
        },
      ] = matchText(
        cafeteriaMatch,
        {
          ...options,
          threshold: 0,
        },
        text
      )
      value = resultValue
    } catch {
      return {
        module: MODULE.CAFETERIA,
        options: { type: 'error', value },
      }
    }
  }
  if (type === TYPE.DAYKO) {
    text = text.replace(/[^\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F]/gi, '')
    try {
      const [
        {
          matches: [{ value: resultValue }],
        },
      ] = matchText(
        dayOfWeekMatch,
        {
          ...options,
          keys: [],
        },
        text
      )
      value = dayOfWeekMatch.indexOf(resultValue)
    } catch {
      return {
        module: MODULE.CAFETERIA,
        options: { type: 'error', value },
      }
    }
  }
  return { module: MODULE.CAFETERIA, options: { type, value } }
}
const matchSchedule = (text: string): MatchCafeteriaModel => {
  const [
    {
      item: { title: type = 'this' },
    },
  ] = matchText(scheduleMatch, options, text || 'this')
  let value
  if (type === TYPE.TARGET) {
    text = text.replace(/[^0-9]/g, '')
    try {
      const [
        {
          matches: [{ value: resultValue }],
        },
      ] = matchText(
        scheduleMatch,
        {
          ...options,
          threshold: 0,
        },
        text
      )
      value = resultValue
    } catch {
      return {
        module: MODULE.SCHEDULE,
        options: { type: 'error', value },
      }
    }
  }
  return { module: MODULE.SCHEDULE, options: { type, value } }
}

const matchText = (matchList, options, text): MatchResultModel[] => {
  return new Fuse(matchList, options).search(text)
}

export const matchModule = (text: string) => {
  text = text.replace(/ /gi, '')
  const modules = matchText(matchType, options, text).filter(
    ({ matches: { length }, score }) => length > 0 && score !== 0.001
  )
  if (modules.length) {
    const isOverlap =
      modules.every(({ score }) => score === modules[0].score) &&
      modules.length > 1
    if (isOverlap) {
      return matchOverlap(modules)
    } else {
      const priority = modules.reduce(
        (acc, cur) => (acc.score > cur.score ? cur : acc)
      )
      return matchPriority(priority, text)
    }
  }
  return { module: MODULE.ECHO, options: { type: 'today', value: 5 } }
}

const matchPriority = (module: MatchResultModel, text: string) => {
  const {
    item: { title },
  } = module
  if (title === 'cafeteria') return matchCafeteria(text)
  if (title === 'schedule') return matchSchedule(text)
}

const matchOverlap = (modules: MatchResultModel[]) => {
  return {
    module: modules.map(({ item: { title } }) => title),
    options: {
      type: 'overlap',
      value: modules.map(({ matches }) =>
        matches.map(({ value }) => value).join(',')
      ),
    },
  }
}
