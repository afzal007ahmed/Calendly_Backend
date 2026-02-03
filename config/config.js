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
    redirect_uri_login : process.env.LOGIN_REDIRECT_URI,
    auth_url : process.env.GOOGLE_AUTH_URL ,
    token_url : process.env.TOKEN_URL,
    client_secret : process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri_connect : process.env.CONNECT_REDIRECT_URI
  },
  frontend : {
    root : process.env.REDIRECT_FRONT_END_ROOT,
    redirect_url : process.env.REDIRECT_FRONT_END_URL
  },
  cors : {
    origin : process.env.CORS_ORIGIN
  }
};

module.exports = { config };
