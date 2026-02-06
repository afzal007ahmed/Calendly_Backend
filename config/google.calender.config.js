const { google } = require("googleapis");
const { config } = require("../config/config");
const users = require("../models/users");

 async function googleCalenderClient(access_token, refresh_token , id ) {
  const oauth2Client = new google.auth.OAuth2(
    config.google.client_id,
    config.google.client_secret,
    config.google.redirect_uri_login,
  );
  oauth2Client.setCredentials({
    refresh_token: refresh_token,
    access_token: access_token,
  });


  oauth2Client.on("tokens", async(tokens) => {
    if (tokens.access_token) {
       await users.updateOne({ _id : id } , { $set : { access_token : tokens.access_token}})
       access_token = tokens.access_token 
    }
  });

  return google.calendar({
    version : 'v3' ,
    auth: oauth2Client
  })
}

module.exports = { googleCalenderClient } ;

