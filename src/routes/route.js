import { Router } from "express";
import { login } from '../controllers/auth';
import { createUser, getLoggedInUser, getUser, listUsers, editUser, removeUser, deposit, resetDeposit } from "../controllers/user";
import { createProduct, updateProduct, removeProduct, listProduct, getProduct, buyProduct} from "../controllers/product"
import { rateLimiter } from "../middlewares/ratelimit";
import { protect } from "../middlewares/auth";
import { sellerProtect } from "../middlewares/seller";
import { buyerProtect } from "../middlewares/buyer";
import { logout } from "../middlewares/logout";
import {loginValidator, logoutValidator} from '../validations/auth';
import {createUserValidator, depositValidator, editUserValidator} from  '../validations/user';
import { createProductValidator, editProductValidator, buyProductValidator } from '../validations/product';
const router = Router();


// Auth route
router.post('/login', rateLimiter('login', 5, 60), loginValidator, login);

router.post('/logout/all', rateLimiter('/logout', 5, 60), logoutValidator, logout);

// User route
router.post('/user', rateLimiter('register', 5, 60), createUserValidator, createUser);

router.get('/user', listUsers);

router.get('/user/me', protect, getLoggedInUser);

router.get('/user/:id', getUser);

router.put('/user/edit/:id', rateLimiter('/user/edit', 5, 60), editUserValidator, editUser);

router.delete('/user/:id', removeUser);

router.post('/deposit', protect, buyerProtect, rateLimiter('/deposit', 5, 60), depositValidator,  deposit);

router.post('/reset', protect, buyerProtect, rateLimiter('/reset', 5, 60), resetDeposit);


// Product route
router.post('/product', protect, sellerProtect, rateLimiter('/product', 5, 60), createProductValidator, createProduct);

router.get('/product', listProduct);

router.get('/product/:id', getProduct);

router.put('/product/edit/:id', protect, sellerProtect, rateLimiter('/product/edit', 5, 60), editProductValidator, updateProduct);

router.delete('/product/:id', protect, sellerProtect, removeProduct);

router.post('/buy', protect, buyerProtect, rateLimiter('/buy', 5, 60), buyProductValidator, buyProduct);






export default router;