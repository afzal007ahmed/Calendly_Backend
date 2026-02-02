const {
  googleAuthMiddleware,
} = require("../middlewares/googleAuth.middleware");
const { authRouter } = require("./auth");
const { googleRouter } = require("./google");

const Router = require("express").Router();

Router.use("/auth", authRouter);
Router.use("/google", googleRouter);

Router.use(googleAuthMiddleware);

module.exports = { Router };
