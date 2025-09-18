const express = require("express")
const router = express.Router()

const { addEyeExam, getEyeExam } = require("../controller/eye-exam-controller")

router.post("/addEyeExam", addEyeExam)
router.get("/getEyeExam", getEyeExam)


module.exports = router