const express = require("express");
const { errorMiddleware } = require("./middlewares/error.middleware");

const app = express();

app.use(express.json());

app.use("/api", require("./routes"));

app.use(errorMiddleware);

module.exports = { app };
