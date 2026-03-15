const express = require("express")
const router = express.Router()

const multer = require("multer")

const upload = multer({dest:"uploads/"})

const {
 createCase,
 getCases,
 assignCase,
  updateStatus,
  getMyCases,
  resolveCase,
  getPublicCases,
  getHotspots
} = require("../controllers/casecontroller")

const {verifyToken,checkRole} = require("../middleware/authMiddleware")

router.post("/", verifyToken, upload.single("attachment"), createCase)

router.get("/", verifyToken, getCases)

router.get("/my", verifyToken, checkRole("case_manager"), getMyCases)

router.get("/public", getPublicCases)

router.get("/hotspots", verifyToken, checkRole("secretariat", "admin"), getHotspots)

router.put("/:id/assign", verifyToken, checkRole("secretariat", "admin"), assignCase)

router.put("/:id/status", verifyToken, checkRole("case_manager"), updateStatus)

router.put("/:id/resolve", verifyToken, checkRole("case_manager"), resolveCase)


module.exports = router