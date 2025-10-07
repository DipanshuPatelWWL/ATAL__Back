const express = require("express");
const router = express.Router();
// const controller = require("../controllers/insuranceClaimController");
// const { protect, adminOnly } = require("../middleware/authMiddleware");
const { getAllClaims, updateClaimStatus, createClaim } = require("../controller/insuranceClaimController");
const { authMiddleware } = require("../middleware/auth-middleware");
const upload = require("../middleware/multer");

// router.post("/", protect, controller.submitClaim);  // Customer submit
// router.get("/customer/history", protect, controller.getCustomerClaims); // Customer history
// router.get("/", protect, adminOnly, controller.getClaims); // Admin view
// router.put("/:id", protect, adminOnly, controller.updateClaimStatus); // Admin update

// module.exports = router;


// Insurance company admin routes
router.get("/claims", getAllClaims);
router.post(
    "/submitClaim",
    upload.fields([{ name: "photos", maxCount: 5 }]),
    createClaim
);
router.put("/claims/:claimId", updateClaimStatus);

module.exports = router;
