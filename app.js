const express = require('express') ;
const { errorMiddleware } = require('./middlewares/error.middleware');
const { Router } = require('./routes/index');
const { googleAuthMiddleware } = require('./middlewares/googleAuth.middleware');
const app = express() ;

app.use( express.json() ) ;

app.use('/' , Router) ;

app.use( errorMiddleware ) ;

module.exports = { app } ;