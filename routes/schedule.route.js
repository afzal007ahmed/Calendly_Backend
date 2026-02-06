const express = require("express");
const router = express.Router();

const {
  getAllSchedules,
  getScheduleById,
  createSchedule,
} = require("../controllers/schedule.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const { googleAuthMiddleware } = require("../middlewares/googleAuth.middleware")

router.use(authMiddleware) ;
router.use(googleAuthMiddleware)

router.get("/", getAllSchedules);
router.get("/:scheduleId", getScheduleById);
router.post("/", createSchedule);

module.exports = router;
