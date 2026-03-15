const isWorkingDay = (date) => {
  const day = date.getDay()
  return day !== 0 && day !== 6 // 0 is Sunday, 6 is Saturday
}

const addWorkingDays = (startDate, days) => {
  let date = new Date(startDate)
  let addedDays = 0
  while (addedDays < days) {
    date.setDate(date.getDate() + 1)
    if (isWorkingDay(date)) {
      addedDays++
    }
  }
  return date
}

const getWorkingDaysBetween = (startDate, endDate) => {
  let count = 0
  let current = new Date(startDate)
  while (current < endDate) {
    current.setDate(current.getDate() + 1)
    if (isWorkingDay(current)) {
      count++
    }
  }
  return count
}

module.exports = { isWorkingDay, addWorkingDays, getWorkingDaysBetween }
