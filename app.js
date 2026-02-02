const express = require('express') ;
const { errorMiddleware } = require('./middlewares/error.middleware');
const app = express() ;

const router = require("./routes"); 

app.use(express.json());

app.use("/", router);

app.use(errorMiddleware);

module.exports = { app };
