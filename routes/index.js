const {
  googleAuthMiddleware,
} = require("../middlewares/googleAuth.middleware");
const express = require("express");
const router = express.Router();
const { authRouter } = require("./auth");
const { googleRouter } = require("./google");
const authRouter = require("./auth");
const scheduleRouter = require("./schedule.route");

router.use("/google", googleRouter);

router.use(googleAuthMiddleware);

router.use("/auth", authRouter);

router.use("/", scheduleRouter);

router.use("/meetings", require("./meeting.route"));

module.exports = router;
