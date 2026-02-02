const express = require("express");
const { errorMiddleware } = require("./middlewares/error.middleware");
const { Router } = require("./routes/index");
const app = express();

app.use("/", Router);

app.use(errorMiddleware);

module.exports = { app };
