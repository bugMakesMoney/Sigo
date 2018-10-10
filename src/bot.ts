import { moduleType } from './constants/matchTypes'

export const sendCafeteria = cafeteria => {
  try {
    const { date, data } = cafeteria
    const { index, type, ko } = date
    console.log('send cafeteria')
    console.log('index', index, 'type', type, 'ko', ko)
    console.log(data)
    if (type === moduleType.TODAY)
      return data ? `오늘 급식\n\n${data}` : '오늘은 급식을 먹는 날이 아닙니다'
    if (type === moduleType.TOMORROW)
      return data ? `내일 급식\n\n${data}` : '내일은 급식을 먹는 날이 아닙니다'
    if (type === moduleType.TARGET)
      return data
        ? `${index}일 ${ko}요일 급식\n\n${data}`
        : `${index}일 ${ko}요일은 급식을 먹는 날이 아닙니다`
    if (type === moduleType.THIS) return `이번 주 급식입니다\n\n${data}`
    if (type === moduleType.NEXT) return `다음 주 급식입니다\n\n${data}`
    if (type === moduleType.ERROR) return `${index}일은 올바른 날짜가 아닙니다`
    else {
      return 'aa'
    }
  } catch (e) {
    return 'aa'
  }
}
