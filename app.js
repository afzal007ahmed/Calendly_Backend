const express = require("express");
const app = express();

const router = require("./routes"); 

const errorMiddleware = require("./middlewares/error.middleware");

app.use(express.json());

app.use("/", router);

app.use(errorMiddleware);

module.exports = { app };
