const express = require('express');
const mainRouter = express.Router();

const welcomeRouter = require('./welcome');
const productsRouter = require('./productsRouter');
const productRouter = require('./productRouter');
const authRouter = require('./authRouter');
const trxRouter = require('./trxRouter');
const addressRouter = require ('./addressRouter');
const userRouter = require ('./userRouter');
const ekspedisiRouter = require ('./ekspedisiRouter');
const chatRouter = require('./chatRouter');
const notifRouter = require('./notifRouter');
//endpoint handler
mainRouter.use("/", welcomeRouter);
mainRouter.use("/products", productsRouter);
mainRouter.use("/product",productRouter); 
mainRouter.use("/products", productsRouter);
mainRouter.use("/address", addressRouter);
mainRouter.use("/auth", authRouter);
mainRouter.use("/transaksi", trxRouter); 
mainRouter.use("/user", userRouter);
mainRouter.use("/kurir", ekspedisiRouter);
mainRouter.use("/chat", chatRouter);
mainRouter.use("/notif", notifRouter);

module.exports = mainRouter;