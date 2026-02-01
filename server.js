require("dotenv").config();
const { app } = require("./app");
const { config } = require("./config/config");
const { connectDB } = require("./connections/mongoose.config");
const { logger } = require("./config/winston.config");
const { initializeModels } = require("./models");

async function server() {
  try {
    await connectDB();
    await initializeModels() ;
    app.listen(config.port, () => {
      logger.info(`Server listening at port : ${config.port}`);
    });
  } catch (error) {
    logger.warn(`Error in server.js : ${error.message}`);
  }
}

server();
