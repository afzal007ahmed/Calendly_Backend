const express = require("express");
const router = express.Router();

const {
  getAllSchedules,
  getScheduleById,
  createSchedule,
  getDetailsofPublicLink
} = require("../controllers/schedule.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/schedules", authMiddleware, getAllSchedules);
router.get("/schedules/:scheduleId", authMiddleware, getScheduleById);
router.post("/schedules", authMiddleware, createSchedule);
router.get("/book/:username/:schedule_id",getDetailsofPublicLink)

module.exports = router;
