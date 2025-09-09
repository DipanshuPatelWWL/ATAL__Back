const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer"); // your multer config
const {createCompany,getCompanies,getCompanyById,updateCompany,deleteCompany,} = require("../controller/company-controller");

router.post("/createcompany",upload.fields([
    { name: "signedAgreement", maxCount: 1 },
    { name: "licenseProof", maxCount: 1 },
    { name: "voidCheque", maxCount: 1 },
  ]),createCompany
);

router.get("/", getCompanies);
router.get("/:id", getCompanyById);

router.put(
  "/:id",
  upload.fields([
    { name: "agreementFile", maxCount: 1 },
    { name: "licenseProof", maxCount: 1 },
    { name: "voidCheque", maxCount: 1 },
  ]),
  updateCompany
);

router.delete("/:id", deleteCompany);

module.exports = router;
