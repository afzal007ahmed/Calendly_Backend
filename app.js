const express = require('express') ;
const cors = require('cors')
const { errorMiddleware } = require('./middlewares/error.middleware');
const app = express() ;

const router = require("./routes"); 
const { config } = require('./config/config');

app.use(express.json());
app.use(cors({
    origin : config.cors.origin ,
    methods : [ "GET" , "POST" , "PUT" , "DELETE"] 
 }))


app.use("/", router);

app.use(errorMiddleware);

module.exports = { app };
