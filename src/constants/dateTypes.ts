const EndDay = {
  day31: [1, 3, 5, 7, 8, 10, 12],
  day30: [4, 6, 9, 11],
  day28: [2],
}

export const checkEndDay = targetMonth => {
  const { day31, day30, day28 } = EndDay
  if (day31.find(month => month === targetMonth)) return 31
  if (day30.find(month => month === targetMonth)) return 30
  if (day28.find(month => month === targetMonth)) return 28
}

export default {
  DayOfWeek: ['일', '월', '화', '수', '목', '금', '토'],
  Day: Array.from({ length: checkEndDay(new Date().getMonth() + 1) }, (v, k) =>
    (k + 1).toString()
  ),
  Month: Array.from({ length: 12 }, (v, k) => (k + 1).toString()),
}
