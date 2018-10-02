import cafeteria from './module/cafeteria'

export const sendTodayRmqtlr = async (
  cafeteria: cafeteria
): Promise<string> => {
  await cafeteria.loadRmqtlr()
  const { date, data } = cafeteria.toadyRmqtlr
  return data ? `${date.ko}요일 급식 \n\n${data}` : '급식을 먹는 날이 아닙니다.'
}

export const sendTomorrowRmqtlr = async (
  cafeteria: cafeteria
): Promise<string> => {
  await cafeteria.loadRmqtlr()
  const { date, data } = cafeteria.tomorrowRmqtlr
  return data ? `${date.ko}요일 급식 \n\n${data}` : '급식을 먹는 날이 아닙니다.'
}
