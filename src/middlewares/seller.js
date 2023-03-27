import { ErrorResponse } from '../common/errorResponse';

export const sellerProtect = (req, res, next) => {
  let user = req.user;
  if (user.role === 'seller') {
    next();
  } else {
    return next(new ErrorResponse('Only sellers allowed', 403));
  }
};
