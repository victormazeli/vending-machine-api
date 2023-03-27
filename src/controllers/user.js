import { ErrorResponse } from '../common/errorResponse';
import User from '../models/user';

/**
 *
 * Create new user
 * @public
 *
 */
export const createUser = async (req, res, next) => {
  const { password, username, role } = req.body;
  try {
    const findUser = await User.findOne({ username });
    if (!findUser) {
      if (!['seller', 'buyer'].includes(role)) {
        return next(new ErrorResponse('Invalid role', 400));
      }
      const payload = {
        password,
        username,
        role,
      };
      const newUser = await User.create(payload);

      const user = newUser.toObject();
      delete user.password;

      return res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: user,
      });
    } else {
      return next(new ErrorResponse('User already exist', 409));
    }
  } catch (error) {
    return next(error);
  }
};

/**
 * Update existing user
 * @private
 */

export const editUser = async (req, res, next) => {
  // const user = req.user;
  const { id } = req.params
  const { username } = req.body;
  try {
    let updatedUser = await User.findOneAndUpdate(
      { _id: id },
      { username },
      {  new: true }
    );

    updatedUser = updatedUser.toObject();

    delete updatedUser.password;

    return res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 *
 * Get current loggedIn user
 * @private
 */
export const getLoggedInUser = async (req, res, next) => {
  const user = req.user;
  return res.status(200).json({
    success: true,
    message: 'User details retrieved successfully',
    data: user,
  });
};

/**
 *
 * Get user info
 * @public
 */
export const getUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    let findUser = await User.findOne({ _id: id });
    if (findUser) {
      findUser = findUser.toObject();
      delete findUser.password;
      return res.status(200).json({
        success: true,
        message: 'User details retrieved successfully',
        data: findUser,
      });
    } else {
      return next(new ErrorResponse('User not found', 404));
    }
  } catch (error) {
    return next(error);
  }
};

/**
 * Renove existing user
 * @public
 */
export const removeUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    const deletedDate = new Date();
    await User.findByIdAndDelete(id);
    return res.status(200).json({
      success: true,
      message: 'User removed successfully',
      data: {},
    });
  } catch (error) {
    return next(error);
  }
};

/**
 *
 * Get User list
 * @public
 */
export const listUsers = async (req, res, next) => {
  try {
    let users = await User.find();
    if (users) {
      users = users.map((user) => {
        const userobj = user.toObject();
        delete userobj.password;

        return userobj;
      });
      return res.status(200).json({
        success: true,
        message: 'User fetched successfully',
        data: users,
      });
    } else {
      return next(new ErrorResponse('No record found', 404));
    }
  } catch (error) {
    return next(error);
  }
};

/**
 *
 * Deposit coin
 * @private
 */
export const deposit = async (req, res, next) => {
  const user = req.user;
  const { deposit } = req.body;
  try {
    // check if coin deposit matches coin denominations
    if (![5, 10, 20, 50, 100].includes(deposit)) {
      return next(new ErrorResponse("Invalid coin deposit: Only 5, 10, 20, 50, and 100 cent coins are accepted", 400));
    }
    await User.findOneAndUpdate(
      { _id: user._id },
      { $inc: { deposit } },
      { new: true }
    );

    // updateUserDetail = updateUserDetail.toObject();
    // delete updateUserDetail.password;

    return res.status(200).json({
      success: true,
      message: 'Coin deposit successful',
      data: {},
    });
  } catch (error) {
    return next(error);
  }
};

/**
 *
 * Reset Deposit 
 * @private
 */
export const resetDeposit = async (req, res, next) => {
  const user = req.user;
  try {
    // if coin exist in your acccount reset to 0 and return coions
    // if user deposit is zero return deposit already zero

    if (user.deposit > 0) {
      const coins = [100, 50, 20, 10, 5];
      const changeCoins = [];
      let remainingChange = user.deposit;

      await User.findOneAndUpdate({_id: user._id}, {
        deposit: 0,
      }, { new: true});

      for (const coin of coins) {
        const coinCount = Math.floor(remainingChange / coin);
        remainingChange -= coin * coinCount;
        changeCoins.push({ coin, count: coinCount });
      }

      return res.status(200).json({
        success: true,
        message: 'Reset deposit successful',
        data: { change: changeCoins},
      });
      
    }else{
      // return error deposit already zero
      return next(new ErrorResponse('Deposit already zero', 400));
    }

  } catch (error) {
    console.log(error)
    return next(error);
  }
  
}