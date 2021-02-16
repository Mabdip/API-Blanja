const express = require('express')
const productRouter = express.Router()
const productController = require('../controllers/productController')

const multiUpload = require('../helpers/uploadImg')

const checkToken = require('../helpers/checkToken')

//add New Product
productRouter.post("/addProduct", checkToken.isLogin, checkToken.isSeller, multiUpload, productController.addNew)
//count UserProducts
productRouter.get("/getCountProduct/:id", checkToken.isLogin, checkToken.isSeller, productController.getCountProduct)
//get All Product based User
productRouter.get('/userProduct', checkToken.isLogin, checkToken.isSeller, productController.getProductFromUser)
//get Data Product 
productRouter.get("/getProductData/:id", productController.getProductId)
//updateProd
productRouter.patch("/updateProduct/:id", checkToken.isLogin, checkToken.isSeller, multiUpload, productController.updateProd)
//deleteProd
productRouter.delete("/deleteProduct/:id", checkToken.isLogin, checkToken.isSeller, productController.deleteProd)

module.exports = productRouter