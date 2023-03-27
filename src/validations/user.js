import joi from 'joi';
import { ErrorResponse } from '../common/errorResponse';

const createUserSchema = joi.object({
    role: joi.string().trim(true).replace('/[^a-zA-Z0-9 ]/g', '').not().empty().required(),
    password: joi.string().alphanum().min(8).trim(true).not().empty().required(),
    username: joi.string().alphanum().min(5).max(15).trim(true).not().empty().required(),
});

const editUserSchema = joi.object({
    username: joi.string().alphanum().min(5).max(15).trim(true).not().empty().required(),
});

const depositSchema = joi.object({
    deposit: joi.number().min(5).max(100).not().empty().required(),
});


export const createUserValidator = (req, res, next) => {
    const payload = {
        username: req.body.username,
        password: req.body.password,
        role: req.body.role,
    }
    const { error } = createUserSchema.validate(payload);
  if (error) {
    res.status(400);
    return next(new ErrorResponse(error.message, 400) )
  } else {
    next();
  }
}

export const editUserValidator = (req, res, next) => {
    const payload = {
        username: req.body.username,
    }
    const { error } = editUserSchema.validate(payload);
  if (error) {
    res.status(400);
    return next(new ErrorResponse(error.message, 400))
  } else {
    next();
  }
}

export const depositValidator = (req, res, next) => {
    const payload = {
        deposit: req.body.deposit,
    }
    const { error } = depositSchema.validate(payload);
  if (error) {
    res.status(400);
    return next(new ErrorResponse(error.message, 400))
  } else {
    next();
  }
}