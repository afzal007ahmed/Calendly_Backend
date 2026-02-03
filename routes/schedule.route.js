const express = require("express");
const router = express.Router();

const {
  getAllSchedules,
  getScheduleById,
  createSchedule,
  getDetailsofPublicLink
} = require("../controllers/schedule.controller");
const authMiddleware = require("../middlewares/auth.middleware");


<<<<<<< HEAD
router.get("/", auth, getAllSchedules);
router.get("/:scheduleId", auth, getScheduleById);
router.post("/", auth, createSchedule);
// router.get("/book/:username/:schedule_id",getDetailsofPublicLink)
=======
router.get("/schedules", authMiddleware, getAllSchedules);
router.get("/schedules/:scheduleId", authMiddleware, getScheduleById);
router.post("/schedules", authMiddleware, createSchedule);
router.get("/book/:username/:schedule_id",getDetailsofPublicLink)
>>>>>>> 84f390dcbb2b14823c49c653741156608193c651

module.exports = router;
