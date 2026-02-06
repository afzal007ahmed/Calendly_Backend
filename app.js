const express = require('express') ;
const cors = require('cors')
const { errorMiddleware } = require('./middlewares/error.middleware');
const app = express() ;
const morgan = require('morgan');

const router = require("./routes"); 
const { config } = require('./config/config');
const logger = require('./utils/logger');

app.use(express.json());
app.use(cors({
    origin : config.cors.origin ,
    methods : [ "GET" , "POST" , "PUT" , "DELETE"] 
 }))

app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

app.use("/", router);

app.use(errorMiddleware);

module.exports = { app };
