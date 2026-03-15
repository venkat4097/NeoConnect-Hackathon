const Case = require("../models/Case")

const generateTrackingId = async () => {
  const year = new Date().getFullYear()
  const startOfYear = new Date(year, 0, 1)
  const endOfYear = new Date(year, 11, 31, 23, 59, 59)

  const count = await Case.countDocuments({
    createdAt: { $gte: startOfYear, $lte: endOfYear }
  })

  const id = String(count + 1).padStart(3, "0")
  return `NEO-${year}-${id}`
}

module.exports = generateTrackingId