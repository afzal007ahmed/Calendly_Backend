const router = require("express").Router();

// router.use("/auth", require("./auth.routes"));
// router.use("/bookings", require("./booking.routes"));
router.use("/meetings", require("./meeting.route"));

module.exports = router;
