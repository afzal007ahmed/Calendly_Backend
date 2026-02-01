const express = require('express') ;
const { errorMiddleware } = require('./middlewares/error.middleware');
const app = express() ;

app.use( express.json() ) ;


app.use( errorMiddleware ) ;

module.exports = { app } ;