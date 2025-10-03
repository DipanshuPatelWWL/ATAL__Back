// const express = require("express");
// const router = express.Router();
// const adminController = require("../controller/admin-controller");
// const upload = require("../middleware/multer");
// const { authMiddleware } = require("../middleware/auth-middleware");

// // Get single admin by ID
// router.get("/getAdminById/:id", adminController.getAdminById);
// router.put("/updateAdminProfile/:id",
//     authMiddleware(),
//     upload.fields([{ name: "profileImage", maxCount: 1 }]),
//     adminController.updateAdminProfile);

// module.exports = router;


const express = require("express");
const router = express.Router();
const adminController = require("../controller/admin-controller");
const upload = require("../middleware/multer");
const { authMiddleware } = require("../middleware/auth-middleware");

//  Serve uploads folder (make sure this is also in app.js/server.js)
const path = require("path");
const app = express();
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

//  Get single admin by ID
router.get("/getAdminById/:id", adminController.getAdminById);

//  Update admin profile with image upload
router.put(
    "/updateAdminProfile/:id",
    authMiddleware(),
    upload.single("profileImage"), // only one image
    adminController.updateAdminProfile
);

module.exports = router;
