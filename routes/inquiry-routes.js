const express = require("express");
const { getAllInquiry, addInquiry, sendResponse, sendResponseAndRegister, getVedorById } = require("../controller/inquiry-controller");
const router = express.Router();

router.get("/getAllInquiry", getAllInquiry);
router.post("/addInquiry", addInquiry);
router.post("/sendResponse", sendResponse);
router.post("/sendResponseAndRegister", sendResponseAndRegister);

module.exports = router;