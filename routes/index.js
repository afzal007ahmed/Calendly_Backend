const {
  googleAuthMiddleware,
} = require("../middlewares/googleAuth.middleware");
const express = require("express");
const router = express.Router();
const { authRouter } = require("./auth");
const { googleRouter } = require("./google");
const scheduleRouter = require("./schedule.route");
const user = require("./user.route");
const meeting = require("./meeting.route");
const availabilityRouter = require("./availability.route");

router.use("/auth", authRouter);

router.use("/google", googleRouter);

router.use("/user", user);

router.use("/meetings", meeting);

router.use("/availability", availabilityRouter);

router.use(googleAuthMiddleware);

router.use("/", scheduleRouter);

module.exports = router;
