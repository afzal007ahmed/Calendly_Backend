const express = require("express");
const { getDetailsofPublicLink } = require("../controllers/schedule.controller");
const router = express.Router();

router.get("/:username/:userId/:schedule_id", getDetailsofPublicLink)

module.exports = router;