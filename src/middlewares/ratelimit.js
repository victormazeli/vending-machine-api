import redis from '../services/redis'
import {ErrorResponse} from '../common/errorResponse'


export const rateLimiter = (prefix, requestLimit, ttl) => {
    return async (req, res, next) => {
        const token = req.token;
        const ip = req.ip;
        let key;

        if (prefix === 'login' || prefix === 'register' || token === undefined || token === "") {
            key = `${prefix}:${ip}`
        }else{
            key = `${prefix}:${ip}:${token}`
        }

        const count = redis.incr(key);

        if (count == 1) {
            redis.expire(key, ttl);
        }

        if (count > requestLimit) {
            return next(new ErrorResponse('Too many request!',429))
        }
        next();

    }


}