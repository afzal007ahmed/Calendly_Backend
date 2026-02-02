const { config } = require("../config/config");

const googleController = {
  auth: async (req, res, next) => {
    try {
      const params = new URLSearchParams({
        client_id: config.google.client_id,
        redirect_uri: config.google.redirect_uri, 
        response_type: "code",
        scope: [
          "openid",
          "profile",
          "email",
          "https://www.googleapis.com/auth/calendar",
          "https://www.googleapis.com/auth/calendar.events",
        ].join(" "),
        access_type: "offline",
        prompt: "consent",
      });
      res.redirect(config.google.auth_url+params) ;
    } catch (error) {
        next(error) ;
    }
  },
  callback : async ( req , res , next ) => {
    console.log("efe") ;
    try {
       const code = req.query.code ;
       if( !code ) {
        const err = new Error("Authorization code is missing.") ;
        err.code = "AUTH_CODE"  
       } 
       res.send({
        code : code 
       })
    } catch (error) {
        next(error)
    }
  }
};


module.exports = { googleController } ;