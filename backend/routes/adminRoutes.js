const express = require("express");

const router = express.Router();

const {
  getProviders,
  getProviderById,
  updateApplicationStatus,
  getDashboardStats,
} = require("../controllers/adminController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

router.get(
  "/providers",
  protect,
  adminOnly,
  getProviders
);

router.get(
  "/providers/:id",
  protect,
  adminOnly,
  getProviderById
);

router.put(
  "/providers/:id/status",
  protect,
  adminOnly,
  updateApplicationStatus
);

router.get(
  "/dashboard",
  protect,
  adminOnly,
  getDashboardStats
);

module.exports = router;