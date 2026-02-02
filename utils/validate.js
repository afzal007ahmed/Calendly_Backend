const validate = (req , type ) => {
  const err = new Error();
  if (!req.body.email?.trim().length) {
    err.message = "Please provide a valid email.";
    err.statusCode = 400;
    err.code = "EMAIL_MISSING";
    throw err;
  } else if (!req.body.password?.trim().length) {
    err.message = "Please provide a valid password.";
    err.statusCode = 400;
    err.code = "PASSWORD_MISSING";
    throw err;
  } else if (!req.body.name?.trim().length && type === "register") {
    err.message = "Please provide a valid name.";
    err.statusCode = 400;
    err.code = "NAME_MISSING";
    throw err;
  }
};

module.exports = { validate } ;
