const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const cron = require("node-cron")
require("dotenv").config()

const authRoutes = require("./routes/authRoutes")
const caseRoutes = require("./routes/caseRoutes")
const pollRoutes = require("./routes/pollRoutes")
const minuteRoutes = require("./routes/minuteRoutes")

const app = express()

app.use(cors())
app.use(express.json())
app.use("/uploads", express.static("uploads"))

mongoose.connect(process.env.MONGO_URI)
.then(()=> console.log("MongoDB Connected"))
.catch(err=>console.log(err))

app.use("/api/auth", authRoutes)
app.use("/api/cases", caseRoutes)
app.use("/api/polls", pollRoutes)
app.use("/api/minutes", minuteRoutes)

const errorHandler = require("./middleware/errorHandler")
app.use(errorHandler)

app.get("/",(req,res)=>{
 res.send("NeoConnect API Running")
})





const { getWorkingDaysBetween } = require("./utils/workingDays")
const Case = require("./models/Case")

cron.schedule("0 0 * * *", async () => {
  const now = new Date()
  const cases = await Case.find({
    status: { $in: ["Assigned", "In Progress", "Pending"] },
  })

  for (let c of cases) {
    const daysSinceLastResponse = getWorkingDaysBetween(c.lastResponseAt, now)
    if (daysSinceLastResponse >= 7) {
      c.status = "Escalated"
      await c.save()
    }
  }
})

const PORT = process.env.PORT || 5000

app.listen(PORT,()=>{
 console.log(`Server running on ${PORT}`)
})