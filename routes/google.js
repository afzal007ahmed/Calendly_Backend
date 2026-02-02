const { googleController } = require('../controllers/google.controller');

const googleRouter = require('express').Router() ;


googleRouter.get('/auth' , googleController.auth ) ;
googleRouter.get('/callback' , googleController.callback ) ;


module.exports = { googleRouter } ;