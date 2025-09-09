// const express = require("express");
// const router = express.Router();
// const vendorController = require("../controller/vendor-controller");
// const upload = require("../middleware/multer"); // your multer config
// const { authMiddleware } = require("../middleware/auth-middleware");



// // Get vendors
// router.get("/allvendor", vendorController.getVendors);

// // Get single vendor
// router.get("/getVendorById/:id", vendorController.getVendorById);

// // Update vendor
// // router.put("/updateVendor/:id", upload.fields([
// //     { name: "certifications", maxCount: 1 },
// //     { name: "certificates", maxCount: 1 }
// // ]), vendorController.updateVendor);

// // Delete vendor
// router.delete("/deleteVendor/:id", vendorController.deleteVendor);

// //update vendor profile
// router.put(
//     "/vendorProfile",
//     authMiddleware,
//     upload.fields([
//         { name: "certifications", maxCount: 5 },
//         { name: "certificates", maxCount: 5 }
//     ]),
//     vendorController.updateProfile
// );

// module.exports = router;



















const express = require("express");
const router = express.Router();
const vendorController = require("../controller/vendor-controller");
const upload = require("../middleware/multer");
const { authMiddleware } = require("../middleware/auth-middleware");

// ✅ Get vendors
router.get("/allvendor", vendorController.getVendors);

// ✅ Get single vendor
router.get("/getVendorById/:id", vendorController.getVendorById);

// ✅ Update vendor profile (authenticated user)
router.put(
    "/vendorProfile",
    authMiddleware(),
    upload.fields([
        { name: "certifications", maxCount: 5 },
        { name: "certificates", maxCount: 5 }
    ]),
    vendorController.updateProfile
);

// ✅ Delete vendor by ID
router.delete("/deleteVendor/:id", vendorController.deleteVendor);

module.exports = router;
