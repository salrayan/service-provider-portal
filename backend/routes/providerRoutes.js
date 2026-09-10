const express = require("express");

const router = express.Router();

const {
  getProfile,
  updateProfile,
  uploadDocuments,
  submitApplication,
  getApplicationStatus,
} = require("../controllers/providerController");

const { protect, providerOnly } = require("../middleware/authMiddleware");

const upload = require("../middleware/uploadMiddleware");

router.get(
  "/profile",
  protect,
  providerOnly,
  getProfile
);

router.put(
  "/profile",
  protect,
  providerOnly,
  updateProfile
);

router.post(
  "/documents",
  protect,
  providerOnly,
  upload.fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "idProof", maxCount: 1 },
    { name: "addressProof", maxCount: 1 },
  ]),
  uploadDocuments
);

router.post(
  "/submit",
  protect,
  providerOnly,
  submitApplication
);

router.get(
  "/status",
  protect,
  providerOnly,
  getApplicationStatus
);

module.exports = router;