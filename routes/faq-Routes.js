const express = require("express");
const router = express.Router();

const { createFAQ, getAllFAQs, deletefaq, updatefaq } = require("../controller/faq-Controller");
const { protect, allowRoles } = require("../middleware/auth-middleware");

router.post('/createfaq', protect, allowRoles("admin"), createFAQ);
router.get('/getallfaq', getAllFAQs);
router.delete('/deletefaq/:id', protect, allowRoles("admin"), deletefaq)
router.put('/updatefaq/:id', protect, allowRoles("admin"), updatefaq)
module.exports = router;
