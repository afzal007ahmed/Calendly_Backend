const jwt = require("jsonwebtoken");
const { config } = require("../config/config");

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const err = new Error();
    const jwtToken = token?.split(" ") ;
    if (!token || !jwtToken[ 1 ]) {
      err.message = "jwt token is missing.";
      err.code = "TOKEN_MISSING";
      throw err;
    } else if (jwtToken[0] !== "Bearer") {
      err.message = "please add Bearer in header.";
      err.code = "BEARER_MISSING";
      throw err;
    }

    req.user = jwt.verify(jwtToken[1], config.jwt.secret);
    next();
  } catch (err) {
    res.status(401).send({
      code: err.code || "OTHER",
      message: err.message,
    });
  }
};

module.exports = authMiddleware ;
