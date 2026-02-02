const Router = require("express").Router();
const { authRouter } = require("./auth");
const meeting = require("./meeting.route");

// router.use("/auth", require("./auth.routes"));
// router.use("/bookings", require("./booking.routes"));

Router.use("/auth", authRouter);

Router.use("/meetings", meeting);
module.exports = { Router };
