const express = require("express")
const router = express.Router()
const multer = require("multer")
const upload = multer({ dest: "uploads/" })
const { uploadMinute, getMinutes, searchMinutes } = require("../controllers/minuteController")
const { verifyToken, checkRole } = require("../middleware/authMiddleware")

router.post("/", verifyToken, checkRole("secretariat", "admin"), upload.single("file"), uploadMinute)
router.get("/", verifyToken, getMinutes)
router.get("/search", verifyToken, searchMinutes)

module.exports = router
