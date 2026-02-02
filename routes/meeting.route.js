const router = require("express").Router();
const {
  getMeetings,
  testFetchMeetings,
} = require("../controllers/meeting.controller");

router.get("/", getMeetings);
router.get("/test", testFetchMeetings);

module.exports = router;
