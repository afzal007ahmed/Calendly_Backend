const authMiddleware = require("../middlewares/auth.middleware");

const router = require("express").Router();

const {
  getUserIdAndName,
  updateUserName,
} = require("../controllers/user.controller");

router.use(authMiddleware);

router.get("/", getUserIdAndName);

router.patch("/name", updateUserName);

module.exports = router;
