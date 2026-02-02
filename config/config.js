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
  },
  google : {
    client_id : process.env.GOOGLE_CILENT_ID,
    redirect_uri : process.env.REDIRECT_URI,
    auth_url : process.env.GOOGLE_AUTH_URL
  }
};

module.exports = { config };
