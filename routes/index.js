const {
  googleAuthMiddleware,
} = require("../middlewares/googleAuth.middleware");
const express = require("express");
const router = express.Router();
const { authRouter } = require("./auth");
const { googleRouter } = require("./google");
const scheduleRouter = require("./schedule.route");
const availabilityRouter = require('./availability.route')

router.use("/auth", authRouter);

router.use("/google", googleRouter);

router.use(googleAuthMiddleware);

router.use("/", scheduleRouter);

router.use("/meetings", require("./meeting.route"));

router.use("/availability", availabilityRouter);

module.exports = router;
