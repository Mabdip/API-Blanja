const express = require('express');
const userController = require('./../controllers/userController');
const userRouter = express.Router();
const checkToken = require('../helpers/checkToken')
userRouter.post("/addReview", userController.addReview);
userRouter.get("/getReview/:productId", userController.getReview);
userRouter.get("/details", checkToken.isLogin, userController.getUserDetails);
userRouter.patch('/changePassword', checkToken.isLogin, userController.changePassword);
userRouter.get('/name/:id', userController.getNameUser);
module.exports = userRouter;
