import joi from 'joi';
import { ErrorResponse } from '../common/errorResponse';

// validation objects
const loginSchema = joi.object({
  username: joi.string().alphanum().min(5).max(15).trim(true).not().empty().required(),
  password: joi.string().alphanum().min(8).trim(true).not().empty().required(),
});

const logoutSchema = joi.object({
  session: joi.string().alphanum().min(24).max(24).trim(true).allow("").required(),
});



// validation middlewares
export const loginValidator = (req, res, next) => {
  const payload = {
    username: req.body.username,
    password: req.body.password,
  };

  const { error } = loginSchema.validate(payload);
  if (error) {
    res.status(400);
    return next(new ErrorResponse(error.message, 400));
  } else {
    next();
  }
};

export const logoutValidator = (req, res, next) => {
  const payload = {
    session: req.body.session,
  };

  const { error } = logoutSchema.validate(payload);
  if (error) {
    res.status(400);
    return next(new ErrorResponse(error.message, 400));
  } else {
    next();
  }
};

