const { googleController } = require('../controllers/google.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const googleRouter = require('express').Router() ;


googleRouter.get('/login/auth' , googleController.auth ) ;
googleRouter.get('/login/callback' , googleController.loginCallback ) ;
googleRouter.get('/connect/auth' , authMiddleware , googleController.authConnect ) ;
googleRouter.get('/connect/callback' , authMiddleware , googleController.connectCallback ) ;


module.exports = { googleRouter } ;