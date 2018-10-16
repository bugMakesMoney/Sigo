export default {
  DayOfWeek: ['일', '월', '화', '수', '목', '금', '토'],
  Day: Array.from({ length: 31 }, (v, k) => (k + 1).toString()),
  Month: Array.from({ length: 12 }, (v, k) => (k + 1).toString()),
}
