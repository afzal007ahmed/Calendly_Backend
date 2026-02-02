const express = require("express");
const router = express.Router();

const {
  getAllSchedules,
  getScheduleById,
  createSchedule,
  getDetailsofPublicLink
} = require("../controllers/schedule.controller");

const auth = require("../middlewares/auth.middleware");

router.get("/", auth, getAllSchedules);
router.get("/:scheduleId", auth, getScheduleById);
router.post("/", auth, createSchedule);
router.get("/book/:username/:schedule_id",getDetailsofPublicLink)

module.exports = router;
