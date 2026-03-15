const express = require("express")
const router = express.Router()

const { createPoll, getPolls, vote } = require("../controllers/pollController")
const { verifyToken, checkRole } = require("../middleware/authMiddleware")

router.post("/", verifyToken, checkRole("secretariat"), createPoll)
router.get("/", verifyToken, getPolls)
router.post("/:id/vote", verifyToken, vote)

module.exports = router