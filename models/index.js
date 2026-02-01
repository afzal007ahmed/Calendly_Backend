const users = require('./users') ;
const availability = require('./availability') ;
const schedule = require('./schedule') ;
const bookings = require('./bookings') ;
const meetings = require('./meetings') ;
const { logger } = require('../config/winston.config');

async function initializeModels() {
     try{
       await users.init() ;
       await availability.init() ;
       await schedule.init() ;
       await bookings.init() ;
       await meetings.init() ;
       logger.info("All collections are created.") 
     }
     catch(err) {
       logger.warn(`Error in collection initialization : ${err.message}`) ;
     }
}


module.exports = { initializeModels } ;