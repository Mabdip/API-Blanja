const express = require('express');
const addressRouter = express.Router();
const addressController = require('./../controllers/addressController');
const checkToken = require('../helpers/checkToken')
addressRouter.post("/new",  addressController.addAddress);
addressRouter.patch("/update/:id", addressController.changeAddress );
addressRouter.get("/:userId", addressController.getAddress);
addressRouter.get("/get/:id", addressController.getAddressId);
addressRouter.delete("/delete/:id", addressController.deleteAdress);

module.exports = addressRouter;
