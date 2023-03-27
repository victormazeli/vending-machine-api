import joi from 'joi';
import { ErrorResponse } from '../common/errorResponse';

const createProductSchema = joi.object({
    productName: joi.string().trim(true).replace('/[^a-zA-Z0-9 ]/g', '').not().empty().required(),
    amountAvailable: joi.number().min(1).not().empty().required(),
    cost: joi.number().min(5).not().empty().required().custom((value, helper) => {
        if (value % 5 === 0) {
            return true
        }else{
            return helper.message('Cost must be a multiple of 5')
        }
    })
});

const editProductSchema = joi.object({
    productName: joi.string().trim(true).replace('/[^a-zA-Z0-9 ]/g', ''),
    amountAvailable: joi.number().min(1),
    cost: joi.number().min(5).custom((value, helper) => {
        if (value % 5 === 0) {
            return true
        }else{
            return helper.message('Cost must be a multiple of 5')
        }
    })
});

const buyProductSchema = joi.object({
    productId: joi.string().alphanum().min(3).max(24).trim(true).not().empty().required(),
    amount: joi.number().min(1),
});


export const createProductValidator = (req, res, next) => {
    const payload = {
        productName: req.body.productName,
        amountAvailable: req.body.amountAvailable,
        cost: req.body.cost,
    }
    const { error } = createProductSchema.validate(payload);
  if (error) {
    res.status(400);
    return next(new ErrorResponse(error.message, 400) )
  } else {
    next();
  }
}

export const editProductValidator = (req, res, next) => {
    const payload = {
        productName: req.body.productName,
        amountAvailable: req.body.amountAvailable,
        cost: req.body.cost,
    }
    const { error } = editProductSchema.validate(payload);
  if (error) {
    res.status(400);
    return next(new ErrorResponse(error.message, 400))
  } else {
    next();
  }
}

export const buyProductValidator = (req, res, next) => {
    const payload = {
        productId: req.body.productId,
        amount: req.body.amount,
    }
    const { error } = buyProductSchema.validate(payload);
  if (error) {
    res.status(400);
    return next(new ErrorResponse(error.message, 400))
  } else {
    next();
  }
}
