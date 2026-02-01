const config = {
  port: process.env.PORT,
  user: {
    name: process.env.MONGO_USER_NAME,
    password: process.env.MONGO_USER_PASSWORD,
  },
  database: {
    name: process.env.DATABASE_NAME,
  },
  mongo_uri: `mongodb+srv://${process.env.MONGO_USER_NAME}:${process.env.MONGO_USER_PASSWORD}@cluster0.caabocs.mongodb.net/${process.env.DATABASE_NAME}?appName=Cluster0`,
  jwt : {
    secret : process.env.JWT_SECRET
  }
};

module.exports = { config };
