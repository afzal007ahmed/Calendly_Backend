const mongoose = require('mongoose') ;
const { config } = require('../config/config');
const { logger } = require('../config/winston.config');

async function connectDB() {
     try {
         await mongoose.connect(config.mongo_uri) ;
         logger.info(`Connected to Database : ${config.database.name}`)

     } catch (error) {
         logger.warn(`Error : ${error.message}`)
     }
}

module.exports = { connectDB } ;