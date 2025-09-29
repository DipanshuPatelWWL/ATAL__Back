const express = require("express");
const router = express.Router();
const controller = require("../controllers/insuranceClaimController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.post("/", protect, controller.submitClaim);  // Customer submit
router.get("/customer/history", protect, controller.getCustomerClaims); // Customer history
router.get("/", protect, adminOnly, controller.getClaims); // Admin view
router.put("/:id", protect, adminOnly, controller.updateClaimStatus); // Admin update

module.exports = router;
