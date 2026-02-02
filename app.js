const express = require('express') ;
const { errorMiddleware } = require('./middlewares/error.middleware');
const app = express() ;
const scheduleRouter = require('./routes/schedule.route.js')


app.use( express.json() ) ;


app.use( errorMiddleware ) ;

app.use('/', scheduleRouter)

module.exports = { app } ;