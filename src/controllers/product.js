import { ErrorResponse } from '../common/errorResponse';
import Product from '../models/product';
import User from '../models/user';

/**
 *
 *  create product
 * @private
 */
export const createProduct = async (req, res, next) => {
  const { productName, cost, amountAvailable } = req.body;
  const user = req.user;
  try {
    const findExistingProduct = await Product.findOne({ productName });
    if (!findExistingProduct) {
      const newProduct = await Product.create({
        productName,
        cost,
        amountAvailable,
        sellerId: user._id,
      });

      return res.status(201).json({
        success: true,
        message: 'Product added successfully',
        data: newProduct,
      });
    } else {
      return next(new ErrorResponse('Product already exist', 409));
    }
  } catch (error) {
    console.log(error.stack + "" + error.message)
    return next(error);
  }
};

/**
 *
 *  update product
 * @private
 */
export const updateProduct = async (req, res, next) => {
  const { id } = req.params;
  const user = req.user;
  try {
    const findProduct = await Product.findById(id);
    if (findProduct.sellerId.toString() === user._id.toString()) {
      const updateProductDetail = await Product.findByIdAndUpdate(
        id,
        req.body,
        { new: true }
      );

      return res.status(200).json({
        success: true,
        message: 'Product updated successfully',
        data: updateProductDetail,
      });
    } else {
      return next(new ErrorResponse('Operation not allowed', 403));
    }
  } catch (error) {
    return next(error);
  }
};

/**
 *
 *  get product
 * @public
 */
export const getProduct = async (req, res, next) => {
  const { id } = req.params;
  try {
    const findProduct = await Product.findById(id).populate(
      'sellerId',
      'username'
    );
    if (findProduct) {
      return res.status(200).json({
        success: true,
        message: 'Product fetched successfully',
        data: findProduct,
      });
    } else {
      return next(new ErrorResponse('Product not found', 404));
    }
  } catch (error) {
    return next(error);
  }
};

/**
 *
 *  list products
 * @public
 */

export const listProduct = async (req, res, next) => {
  try {
    const findProduct = await Product.find().populate(
      'sellerId',
      'username'
    );
    if (findProduct) {
      return res.status(200).json({
        success: true,
        message: 'Product fetched successfully',
        data: findProduct,
      });
    } else {
      return next(new ErrorResponse('Product not found', 404));
    }
  } catch (error) {
    return next(error);
  }
};

/**
 *
 *  remove product
 * @private
 */

export const removeProduct = async (req, res, next) => {
  const { id } = req.params;
  const user = req.user;
  try {
    const findProduct = await Product.findById(id);
    if (findProduct.sellerId.toString() === user._id.toString()) {
      await Product.findByIdAndDelete(id);

      return res.status(200).json({
        success: true,
        message: 'Product removed successfully',
        data: {},
      });
    } else {
      return next(new ErrorResponse('Operation not allowed', 403));
    }
  } catch (error) {
    return next(error);
  }
};
/**
 *
 *  buy product
 * @private
 */
export const buyProduct = async (req, res, next) => {
  const { productId, amount } = req.body;
  const user = req.user;
  try {
    const findProduct = await Product.findOne({_id: productId});
    if (findProduct) {
      if (findProduct.amountAvailable >= amount) {
        const totalCost = findProduct.cost * amount;
        // const userDetail = await User.findById(req.user.id);
        if (parseFloat(user.deposit) >= parseFloat(totalCost)) {
          const change = parseFloat(user.deposit) - parseFloat(totalCost);
          const coins = [100, 50, 20, 10, 5];
          const changeCoins = [];
          let remainingChange = change;

          await User.findOneAndUpdate({_id: user._id}, {
            deposit: change,
          });

          for (const coin of coins) {
            const coinCount = Math.floor(remainingChange / coin);
            remainingChange -= coin * coinCount;
            changeCoins.push({ coin, count: coinCount });
          }

          await Product.findOneAndUpdate({_id: productId}, {
            $inc: { amountAvailable: -amount },
          });
          return res.status(200).json({
            success: true,
            message: 'Product purchase successful',
            data: {
              totalSpent: totalCost,
              productPurchased: findProduct,
              change: changeCoins,
            },
          });
        } else {
          return next(new ErrorResponse('Insufficient deposit: Please deposit more coins', 400));
        }
      } else {
        return next(new ErrorResponse('Insufficient product available', 400));
      }
    } else {
      return next(new ErrorResponse('Product not found', 404));
    }
  } catch (error) {
    return next(error);
  }
};
