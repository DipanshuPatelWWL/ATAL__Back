const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const {
  addsubcategory,
  getsubCategories,
  deletesubCategory,
  updateSubcategory,
  getSubcategoriesByCatSec,
  getSubcategoriesByCategoryId,
} = require("../controller/subcategory-controller");

router.post("/addsubcategory", upload.single("image"), addsubcategory);
router.get("/getallsubcategory", getsubCategories);
router.delete("/deletesubcategory/:id", deletesubCategory);
router.put("/updatesubcategory/:id", upload.single("image"), updateSubcategory);
router.get("/getBySubCategory/:cat_sec", getSubcategoriesByCatSec);
// router.get("/categories/:cat_id", getSubcategoriesByCategoryId);

module.exports = router;
