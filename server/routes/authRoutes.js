const express = require("express")
const router = express.Router()

const { register, login, getUsers } = require("../controllers/authController")
const { verifyToken, checkRole } = require("../middleware/authMiddleware")

router.post("/register", register)
router.post("/login", login)
router.get("/users", verifyToken, checkRole("secretariat", "admin"), getUsers)

module.exports = router