import Session from '../models/session';
import { ErrorResponse } from '../common/errorResponse';

export const logout = async (req, res, next) => {
  let token;

  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (token === '' || token === undefined) {
      // check request body
      if (req.body.session === '') {
        return next(new ErrorResponse('logout failed', 400));
      } else {
        const sessionId = req.body.session;

        await Session.findOneAndUpdate(
          { _id: sessionId },
          { isActive: false, token: 'invalidated' },
          { upsert: false }
        );
        return res.status(200).json({
          success: true,
          message: 'All sessions terminated successfully',
          data: null,
        });
      }
    } else {
      await Session.findOneAndUpdate(
        { token: token },
        { isActive: false, token: 'invalidated' },
        { upsert: false }
      );
      return res.status(200).json({
        success: true,
        message: 'All sessions terminated successfully',
        data: null,
      });
    }
  } catch (error) {
    return next(new ErrorResponse('logout failed', 400));
  }
};
