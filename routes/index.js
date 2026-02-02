const express = require("express");
const router = express.Router();

const authRouter = require("./auth");
const scheduleRouter = require("./schedule.route");

router.use("/auth", authRouter);

router.use("/", scheduleRouter);

module.exports = router;
