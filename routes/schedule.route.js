const express = require("express");
const router = express.Router();

const {
  getAllSchedules,
  getScheduleById,
  createSchedule,
} = require("../controllers/schedule.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/", authMiddleware, getAllSchedules);
router.get("/:scheduleId", authMiddleware, getScheduleById);
router.post("/", authMiddleware, createSchedule);

module.exports = router;
