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
    values: Array.from({ length: 31 }, (v, k) => (k + 1).toString()),
  },
]

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
    values: Array.from({ length: 12 }, (v, k) => (k + 1).toString),
  },
  {
    title: 'all',
    values: '이번년도, 전체',
  },
]

export const moduleType = {
  CAFETERIA: 'cafeteria',
  SCHEDULE: 'schedule',
  TODAY: 'today',
  TOMORROW: 'tomorrow',
  TARGET: 'target',
  NEXT: 'next',
  THIS: 'this',
  ERROR: 'error',
}
