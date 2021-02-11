const express = require('express');
const authController = require ('../controllers/authController');
const authRouter = express.Router();

const checkToken = require('../helpers/checkToken');

authRouter.post("/signup",checkToken.isRegistered, authController.signup);
authRouter.get("/activate/:email/:otp",authController.activate);
authRouter.post("/resend", authController.resend);
authRouter.post("/login", authController.login);
authRouter.post("/forgot", authController.forgot);
authRouter.get("/otp/:email/:otp", authController.otp);
authRouter.patch("/reset", authController.reset);
authRouter.post("/logout",checkToken.isLogin, authController.logout);
authRouter.get("/checkTokenExpired/:token", authController.checkExpired);



module.exports = authRouter;
