const { Router } = require("express");
const { getAllSchedules, getScheduleById, createSchedule } = require("../controllers/schedule");

const router = Router();

router.route('/').get(getAllSchedules)
// router.route('/').get(getScheduleById) // update
router.route('/').post(createSchedule) 
router.route('/book/').get(getScheduleById) //update

module.exports = router