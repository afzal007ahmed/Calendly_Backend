const express = require("express");
const router = express.Router();

const {
  getAllSchedules,
  getScheduleById,
  createSchedule,
  deleteSchedule
} = require("../controllers/schedule.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const { googleAuthMiddleware } = require("../middlewares/googleAuth.middleware")

router.use(authMiddleware) ;
router.use(googleAuthMiddleware)

router.get("/", getAllSchedules);
router.get("/:scheduleId", getScheduleById);
router.post("/", createSchedule);
router.post('/delete',deleteSchedule);

module.exports = router;
