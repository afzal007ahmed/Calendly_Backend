const express = require("express");
const router = express.Router();

const authRouter = require("./auth");
const scheduleRouter = require("./schedule.route");

router.use("/auth", authRouter);

router.use("/", scheduleRouter);

router.use("/meetings", require("./meeting.route"));

module.exports = router;
