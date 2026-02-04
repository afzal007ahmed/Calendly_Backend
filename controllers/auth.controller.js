const users = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validate } = require("../utils/validate");
const { config } = require("../config/config");

const authController = {
  register: async (req, res, next) => {
    try {
      validate(req, "register");
      const user = await users.findOne({ email : req.body.email} ) ;
      if( user ) {
        const err = new Error("User already exists.") ;
        err.statusCode = 409;
        err.code = "USER_DUPLICATE"
        throw err ;
      }
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      await users.create({
        name: req.body.name,
        password: hashedPassword,
        email: req.body.email,
      });

      res.status(201).send({
        success: true,
        error: null,
      });
    } catch (error) {
      next(error);
    }
  },
  login: async (req, res, next) => {
    try {
      validate(req, "login");
      const user = await users.findOne({ email: req.body.email });
      const err = new Error();
      if (!user) {
        err.message = "User not found";
        err.statusCode = 404;
        err.code = "USER_NOT_FOUND";
        throw err;
      } else if (!user.password) {
        err.message = "User password not set";
        err.statusCode = 403;
        err.code = "USER_PASSWORD_MISSING";
        throw err ;
      } else if (!(await bcrypt.compare(req.body.password, user.password))) {
        err.message = "password mismatch";
        err.statusCode = 401;
        err.code = "PASSWORD_MISMATCH";
        throw err;
      }
      const token = jwt.sign({ id: user._id }, config.jwt.secret, {
        expiresIn: 60 * 60,
      });
      res.status(200).send({
        token: token,
        success: true,
        error: null,
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = authController ;
