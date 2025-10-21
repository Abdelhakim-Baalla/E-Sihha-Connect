const express = require("express");
const { getAvailability } = require("../controllers/availabilityController");
const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", verifyToken, getAvailability);

module.exports = router;
