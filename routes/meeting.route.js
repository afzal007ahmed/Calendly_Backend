const router = require("express").Router();
const {
  getMeetings,
  testFetchMeetings,
} = require("../controllers/meeting.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.use(authMiddleware);

router.get("/", getMeetings);

module.exports = router;
