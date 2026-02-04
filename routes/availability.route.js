const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const { getAvailabilityforUser, updateAvailability } = require("../controllers/availability.controller");

router.get("/", auth, getAvailabilityforUser);
router.put("/", auth, updateAvailability);

module.exports = router;
