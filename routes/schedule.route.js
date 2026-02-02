const express = require("express");
const router = express.Router();

const {
  getAllSchedules,
  getScheduleById,
  createSchedule,
  getDetailsofPublicLink
} = require("../controllers/schedule.controller");

const auth = require("../middlewares/auth.middleware");

router.get("/schedules", auth, getAllSchedules);
router.get("/schedules/:scheduleId", auth, getScheduleById);
router.post("/schedules", auth, createSchedule);
router.get("/book/:username/:schedule_id",getDetailsofPublicLink)

module.exports = router;
