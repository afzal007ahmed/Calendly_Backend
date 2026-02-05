const { googleController } = require('../controllers/google.controller');

const googleRouter = require('express').Router() ;


googleRouter.get('/login/auth' , googleController.auth ) ;
googleRouter.get('/login/callback' , googleController.loginCallback ) ;
googleRouter.get('/connect/auth' ,  googleController.authConnect ) ;
googleRouter.get('/connect/callback' , googleController.connectCallback ) ;


module.exports = { googleRouter } ;