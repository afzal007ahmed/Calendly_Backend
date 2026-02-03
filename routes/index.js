const express = require("express");
const router = express.Router();

const authRouter = require("./auth");
const scheduleRouter = require("./schedule.route");
const availabilityRouter = require('./availability.route')

router.use("/auth", authRouter);

router.use("/schedules", scheduleRouter);

router.use("/meetings", require("./meeting.route"));

router.use("/availability", availabilityRouter);

module.exports = router;
