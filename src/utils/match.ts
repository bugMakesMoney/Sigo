import * as Fuse from 'fuse.js'
import {
  matchType,
  cafeteriaMatch,
  moduleType,
  scheduleMatch,
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
  let value = text.replace(/[^0-9]/g, '')
  if (type === moduleType.TARGET) {
    try {
      value = matchText(
        cafeteriaMatch,
        {
          ...options,
          threshold: 0,
        },
        value
      )[0].matches[0].value
    } catch {
      return {
        module: moduleType.CAFETERIA,
        options: { type: 'error', value },
      }
    }
  }
  return { module: moduleType.CAFETERIA, options: { type, value } }
}

const matchSchedule = (text: string): MatchCafeteriaModel => {
  const type = matchText(
    scheduleMatch,
    { keys: ['values'], threshold: 0 },
    text || 'this'
  )[0]

  return { module: moduleType.SCHEDULE, options: { type: 'type', value: 0 } }
}

const matchText = (matchList, options, text): MatchResultModel[] => {
  return new Fuse(matchList, options).search(text)
}

export const matchModule = (text: string) => {
  text = text.replace(/ /gi, '')
  const modules = matchText(matchType, options, text).filter(
    module => module.matches.length > 0 && module.score !== 0.001
  )
  if (modules.length) {
    const isOverlap =
      modules.every(module => module.score === modules[0].score) &&
      modules.length > 1
    if (isOverlap) {
    } else {
      const priority = modules.reduce(
        (acc, cur) => (acc.score > cur.score ? cur : acc)
      )
      return matchPriority(priority, text)
    }
  }
  return { module: moduleType.SCHEDULE, options: { type: 'today', value: 5 } }
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
    type: 'overlap',
    value: modules.map(({ matches }) => matches.map(m => m.value).join(',')),
  }
}
