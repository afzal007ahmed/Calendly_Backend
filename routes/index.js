const { authRouter } = require('./auth');

const Router = require('express').Router(); 

Router.use('/auth' , authRouter) ;


module.exports = { Router } ;