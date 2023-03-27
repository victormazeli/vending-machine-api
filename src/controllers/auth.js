import { ErrorResponse } from '../common/errorResponse';
// import redis from '../services/redis';
import User from '../models/user';
import Session from '../models/session';
import argon2 from 'argon2';
// import * as jwt from 'jsonwebtoken';
import devConfig from '../config/var';
import { generateAccessToken } from '../common/token-generator';
import moment from 'moment';

/**
 *
 * Login
 * @public
 */

export const login = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    //
    const user = await User.findOne({ username });
    if (user) {
      const checkPassword = await argon2.verify(user.password, password);
      //if password match
      if (checkPassword) {
        // Check if there are any active sessions for this user
        const activeSession = await Session.findOne({
          userId: user.id,
          isActive: true,
        });
        const currentDate = new Date();
        // console.log(activeSession)
        if (activeSession && (!moment(currentDate).isAfter(activeSession.expiryTime))) {
          return res.status(401).json({
            success: false,
            message: 'There is already an active session using your account',
            data: { session: activeSession.id },
          });
        } else {
          // invalidate token
          await Session.findOneAndUpdate(
            { userId: user.id },
            { isActive: false, token: 'invalidated' },
            { upsert: false }
          );
          // generate token and return token
          const token = generateAccessToken(devConfig.jwtKey);

          // Create a new session for the user
          const expiryTime = moment().add('1', 'hour');
          await Session.create({ userId: user.id, token, expiryTime });

          return res.status(200).json({
            success: true,
            message: 'login successful',
            data: { token },
          });
        }
      } else {
        return next(new ErrorResponse('invalid credentials', 401));
      }
    } else {
      return next(new ErrorResponse('invalid credentials', 401));
    }
  } catch (error) {
    return next(error);
  }
};
