const productModel = require('../models/productModel')
const form = require('../helpers/form')
const fs = require('fs')

module.exports = {
    getProductFromUser: (req, res) => {
        const { id } = req.params
        productModel.getProductFromUser(id)
            .then((data) => {
                res.status(200).json(data)
            }).catch((error) => {
                res.status(500).json(error)
            })
    },
    getCountProduct: (req, res) => {
        const { id } = req.params
        productModel.getCountProduct(id)
            .then((data) => {
                res.status(200).json(data)
            }).catch((error) => {
                res.status(500).json(error)
            })
    },
    getProductId: (req, res) => {
        const { id } = req.params
        productModel.getProductId(id)
            .then((data) => {
                res.status(200).json(data)
            })
            .catch((err) => {
                res.status(500).json(error)
            })
    },
    addNew: (req, res) => {
        let Product_inserted;
        let insert_product = req.body
        const { user_id } = req.decodedToken
        if (req.filePath != '') {
            insert_product = {
                ...insert_product,
                user_id,
                product_img: req.filePath
            }
            const res_img = req.filePath.split(",")
            Product_inserted = {
                ...insert_product,
                product_img: res_img
            }
        } else {
            Product_inserted = insert_product
        }
        productModel.addNew(insert_product)
            .then((data) => {
                form.success(res, {
                    ...data,
                    Product_inserted
                })
            }).catch((err) => {
                res.json(err)
            })
    },
    updateProd: (req, res) => {
        const { id } = req.params
        let { body } = req
        if (req.filePath != '') {
            body = {
                ...body,
                product_img: req.filePath
            }
            productModel.deleteFile(id)
                .then((result) => {
                    if (result[0]) {
                        result[0].product_img.split(",").map((image) =>
                            fs.unlink(`public${image}`, (err) => {
                                if (err) {
                                    console.log(err)
                                    return
                                } else {
                                    console.log(`public${image} deleted`)
                                }
                            })
                        )
                    }
                }).catch((err) => {
                    console.log(err)
                })
        }
        productModel.updateProd(body, id)
            .then((pesan) => {
                const updated = {
                    ...body,
                    product_img: req.filePath.split(",")

                }
                res.status(200).json({ pesan, updated })
            }).catch((error) => {
                res.status(500).json(error)
            })
    },
    deleteProd: (req, res) => {
        const { id } = req.params
        productModel.deleteFile(id)
            .then((result) => {
                productModel.deleteProd(id)
                    .then((data) => {
                        if (result[0]) {
                            result[0].product_img.split(",").map((image) =>
                                fs.unlink(`public${image}`, (err) => {
                                    if (err) {
                                        console.log(err)
                                        return
                                    } else {
                                        console.log(`public${image} deleted`)
                                    }
                                })
                            )
                        }
                        res.status(200).json(data)
                    }).catch((error) => {
                        res.status(500).json(error)
                    })
            }).catch((error) => {
                res.status(500).json(error)
            })
    },
}