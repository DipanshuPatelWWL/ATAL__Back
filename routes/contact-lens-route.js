const express = require("express")
const router = express.Router()
const upload = require("../middleware/multer");
const { protect, allowRoles } = require("../middleware/auth-middleware");
const lensController = require("../controller/contact-lens-controller")


router.post(
    "/addLens",
    upload.fields([
        { name: "lens_image_collection", maxCount: 10 },
    ]),
    protect, allowRoles("admin"),
    lensController.addLens
);

router.get("/getLensById/:id", lensController.getLensById);

router.put(
    "/updateLens/:id",
    upload.fields([
        { name: "lens_image_collection", maxCount: 10 },
    ]),
    protect, allowRoles("admin"),
    lensController.updateLens
);
router.delete("/deleteLens/:id", protect, allowRoles("admin"), lensController.deleteLens);


router.get("/getAllLens", lensController.getAllLens);


module.exports = router