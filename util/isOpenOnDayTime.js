const DAYS_OF_WEEK = [
  'sun',
  'mon',
  'tue',
  'wed',
  'thu',
  'fri',
  'sat'
]

function getSeconds (timeString) { // Example: 1430 ==> 14.5 hours ==> 52,200 seconds
  const hours = Number(timeString.substring(0, timeString.length - 2))
  const minutes = Number(timeString.substring(timeString.length - 2))
  return (hours * 60 * 60) + (minutes * 60)
}

// TODO: Make this always use the current time in the Pacific Time Zone, whether on the client or server
function isOpenOnDayTime ({day, open, close, targetTime}) {
  if (day && open && close) {
    // const today = new Date()

    // SHIM: The date here is arbitrary
    const now = targetTime ? new Date(`October 24, 2017 ${targetTime}`) : new Date()

    const pacificTime = (now.toString().indexOf('(PDT)') >= 0) || (now.toString().indexOf('(PST)') >= 0)
    const nowSeconds = (now.getHours() * 60 * 60) + (now.getMinutes() * 60) + now.getSeconds()

    // targetTime not yet checking for days of the week
    if (pacificTime &&
      (DAYS_OF_WEEK[now.getDay()] === day.toLowerCase() || targetTime) &&
      nowSeconds > getSeconds(open) &&
      nowSeconds < getSeconds(close)) {
      return true
    }
    // TBD: Should we show a special notice if it’s opening soon or closing soon?
  }
  return false
}

export default isOpenOnDayTime
