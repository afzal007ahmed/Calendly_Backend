const { config } = require("../config/config");
const axios = require("axios");
const users = require("../models/users");
const { jwtDecode } = require("jwt-decode");
const jwt = require("jsonwebtoken");

const googleController = {
  auth: async (_req, res, next) => {
    try {
      const params = new URLSearchParams({
        client_id: config.google.client_id,
        redirect_uri: config.google.redirect_uri_login,
        response_type: "code",
        scope: [
          "openid",
          "profile",
          "email",
          "https://www.googleapis.com/auth/calendar",
        ].join(" "),
        access_type: "offline",
        prompt: "consent",
      });
      res.redirect(config.google.auth_url + params);
    } catch (error) {
      next(error);
    }
  },
  loginCallback: async (req, res, next) => {
    try {
      const code = req.query.code;
      const error = req.query.error;
      if (error) {
        return res.redirect(config.frontend.root + "login");
      }
      const err = new Error();
      if (!code) {
        const params = new URLSearchParams({
          message: "Google login failed. Please try again",
        }).toString();
        return res.redirect(config.frontend.redirect_login_url + "?" + params);
      }
      const tokenRes = await axios.post(
        config.google.token_url,
        new URLSearchParams({
          client_id: config.google.client_id,
          client_secret: config.google.client_secret,
          redirect_uri: config.google.redirect_uri_login,
          grant_type: "authorization_code",
          code: code,
        }),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        },
      );

      const { access_token, refresh_token, scope, id_token } = tokenRes.data;
      if (!scope.includes("https://www.googleapis.com/auth/calendar")) {
        const params = new URLSearchParams({
          message:
            "Please allow access for calender events while login from google",
        }).toString();
        return res.redirect(config.frontend.redirect_login_url + "?" + params);
      }
      const { email, name } = jwtDecode(id_token);

      const user = await users.findOne({ email: email });
      let user_id;
      if (!user) {
        const { _id } = await users.create({
          name: name,
          email: email,
          access_token: access_token,
          refresh_token: refresh_token,
        });
        user_id = _id;
      } else {
        const update = {};
        user_id = user._id;
        if (access_token) {
          update.access_token = access_token;
        }
        if (refresh_token) {
          update.refresh_token = refresh_token;
        }
        await users.updateOne(
          { email: email },
          {
            $set: update,
          },
        );
      }
      const token = jwt.sign({ id: user_id }, config.jwt.secret);
      res.redirect(config.frontend.redirect_url + `?token=${token}`);
    } catch (error) {
      next(error);
    }
  },
  authConnect: async (req, res, next) => {
    try {
      const token = req.query.token;
      if (!token) {
        return res.redirect(config.frontend.redirect_login_url);
      }

      req.user = jwt.verify(token, config.jwt.secret);
      const state = jwt.sign({ id: req.user.id }, config.jwt.secret, {
        expiresIn: "5m",
      });
      const params = new URLSearchParams({
        client_id: config.google.client_id,
        redirect_uri: config.google.redirect_uri_connect,
        response_type: "code",
        scope: [
          "openid",
          "profile",
          "email",
          "https://www.googleapis.com/auth/calendar",
        ].join(" "),
        access_type: "offline",
        prompt: "consent",
        state,
      });
      res.redirect(config.google.auth_url + params);
    } catch (error) {
      next(error);
    }
  },
  connectCallback: async (req, res, next) => {
    try {
      const code = req.query.code;
      if (!code) {
        return res.redirect(config.frontend.root);
      }
      const tokenRes = await axios.post(
        config.google.token_url,
        new URLSearchParams({
          client_id: config.google.client_id,
          client_secret: config.google.client_secret,
          redirect_uri: config.google.redirect_uri_connect,
          grant_type: "authorization_code",
          code: code,
        }),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        },
      );
      req.user = jwt.verify(req.query.state, config.jwt.secret);
      const { access_token, refresh_token, scope, id_token } = tokenRes.data;
      if (!scope.includes("https://www.googleapis.com/auth/calendar")) {
        const params = new URLSearchParams({
          message:
            "Please allow access for calender events while login from google",
        }).toString();
        return res.redirect(config.frontend.root + "?" + params);
      }
      const userDetails = jwtDecode(id_token);
      const gotUser = await users.findOne({ email: userDetails.email });
      const currUser = await users.findOne({ _id: req.user.id });
      if (!gotUser || gotUser.email !== currUser.email) {
        const params = new URLSearchParams({
          message:
            "Please add same gmail account from which you are logged in",
        }).toString();
        return res.redirect(config.frontend.root + "?" + params);
      }

      await users.updateOne(
        { _id: req.user.id },
        {
          $set: { access_token: access_token, refresh_token: refresh_token },
        },
      );

      res.redirect(config.frontend.root);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = { googleController };
