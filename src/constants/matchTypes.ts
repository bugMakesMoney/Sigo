import dateTypes from './dateTypes'

export const matchType = [
  {
    title: 'cafeteria',
    values: ['급식', '밥', '점심', 'rmqtlr'],
  },
  {
    title: 'schedule',
    values: ['일정', '스케줄', 'wjatla'],
  },
  {
    title: 'weather',
    values: ['날씨'],
  },
]
const DayOfWeek = dateTypes.DayOfWeek.slice(1, -1)
export const cafeteriaMatch = [
  {
    title: 'today',
    values: ['오늘'],
  },
  {
    title: 'tomorrow',
    values: ['내일', '낼'],
  },
  {
    title: 'next',
    values: ['다음주', '담주'],
  },
  {
    title: 'this',
    values: ['이번주', '요번주'],
  },
  {
    title: 'target',
    values: dateTypes.Day,
  },
  {
    title: 'dayko',
    values: DayOfWeek.concat(Array.from(DayOfWeek, d => d + '요')).concat(
      Array.from(DayOfWeek, d => d + '욜')
    ),
  },
]

export const dayOfWeekMatch = DayOfWeek

export const scheduleMatch = [
  {
    title: 'this',
    values: ['이번달', '요번달'],
  },
  {
    title: 'next',
    values: ['다음달', '담달'],
  },
  {
    title: 'target',
    values: dateTypes.Month,
  },
  {
    title: 'all',
    values: '이번년도, 전체',
  },
]

export const MODULE = {
  CAFETERIA: 'cafeteria',
  SCHEDULE: 'schedule',
  ECHO: 'echo',
}

export const TYPE = {
  TODAY: 'today',
  TOMORROW: 'tomorrow',
  TARGET: 'target',
  NEXT: 'next',
  THIS: 'this',
  DAYKO: 'dayko',
  ERROR: 'error',
  OVERLAP: 'overlap',
}
