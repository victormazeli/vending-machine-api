import moment from 'moment';
import { ErrorResponse } from '../common/errorResponse';
// import redis from '../services/redis';
// import devConfig from '../config/var';
import Session from '../models/session';
import User from '../models/user';
// import * as jwt from 'jsonwebtoken';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (token === '' || token === undefined) {
    return next(new ErrorResponse('Bearer token can not be empty', 401));
  }

  try {
    // if session is active
    const checkToken = await Session.findOne({token: token});
    const currentDate = new Date();
    if (checkToken) {
      const isExpire = moment(currentDate).isAfter(checkToken.expiryTime)
      if (!isExpire) {
        let user = await User.findById(checkToken.userId);
        if (!user) {
          return next(
            new ErrorResponse('Not authorize to access this route', 401)
          );
        }
        user = user.toObject();
        delete user.password
        req.user = user;
        req.token = token;
        next();
        
      }else{
        return next(new ErrorResponse('Token has expired', 401));
      }
    } else {
      return next(new ErrorResponse('Invalid token', 401));
    }
  } catch (error) {
    return next(new ErrorResponse('Not authorize to access this route', 401));
  }
};
