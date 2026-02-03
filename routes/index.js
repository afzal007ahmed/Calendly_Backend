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

<<<<<<< HEAD
router.use("/schedules", scheduleRouter);
=======
router.use("/google", googleRouter);

router.use(googleAuthMiddleware);

router.use("/", scheduleRouter);
>>>>>>> 84f390dcbb2b14823c49c653741156608193c651

router.use("/meetings", require("./meeting.route"));

router.use("/availability", availabilityRouter);

module.exports = router;
