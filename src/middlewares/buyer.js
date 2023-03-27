import { ErrorResponse } from '../common/errorResponse';

export const buyerProtect = (req, res, next) => {
    let user = req.user;
     if (user.role === "buyer") {
        next();
        
     }else{
        return next(new ErrorResponse('Only buyers allowed', 403));
     }

}