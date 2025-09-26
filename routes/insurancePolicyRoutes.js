const express = require("express");
const router = express.Router();
const controller = require("../controller/insurancePolicyController");



router.post("/addPolicies", controller.addPolicy);
router.get("/getPolicies", controller.getPolicies);
router.put("/updatePolicy/:id", controller.updatePolicy);
router.delete("/deletePolicy/:id", controller.deletePolicy);

module.exports = router;
