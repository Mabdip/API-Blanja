const { query } = require('express')
const db = require('../config/mySQL')
module.exports = {
    getCountProduct: (id) => {
        return new Promise((resolve, reject) => {
            const queryStr =
                `SELECT COUNT(p.id) as total_product
            FROM products p
            JOIN category c ON p.category_id = c.id
            JOIN color cl ON p.color_id = cl.id
            JOIN size s ON p.size_id = s.id
            JOIN conditions cd ON p.condition_id = cd.id
            WHERE user_id = ?`
            db.query(queryStr, id, (err, data) => {
                if (!err) {
                    resolve({
                        status: 200,
                        message: 'sukses',
                        ...data[0]
                    })
                } else {
                    reject({
                        status: 500,
                        message: err
                    })
                }
            })
        })
    },
    getProductFromUser: (id) => {
        return new Promise((resolve, reject) => {
            const queryStr =
            `SELECT p.id, p.product_name, c.category_name, cl.color_name, s.size_name, cd.condition_name, p.product_img, p.product_price, p.created_at
            FROM products p
            JOIN category c ON p.category_id = c.id
            JOIN color cl ON p.color_id = cl.id
            JOIN size s ON p.size_id = s.id
            JOIN conditions cd ON p.condition_id = cd.id
            WHERE user_id = ?
            ORDER BY p.created_at DESC`
            db.query(queryStr, id, (err, data) => {
                if (!err) {
                    resolve({
                        status: 200,
                        message: 'sukses',
                        data: data
                    })
                } else {
                    reject({
                        status: 500,
                        message: err
                    })
                }
            })
        })
    },
    getProductId: (id) => {
        return new Promise((resolve, reject) => {
            const queryStr =
            `SELECT p.id, p.user_id as seller_id, u.fullname, p.product_name,p.category_id, c.category_name,p.color_id, cl.color_name,p.size_id, s.size_name,p.condition_id, cd.condition_name,p.product_img, p.product_price,p.product_desc, u.storeName,IFNULL(rev.rating,0) as rating, IFNULL(rev.dibeli,0) as dibeli
            FROM products p
            JOIN category c ON p.category_id = c.id
            JOIN color cl ON p.color_id = cl.id
            JOIN size s ON p.size_id = s.id
            JOIN conditions cd ON p.condition_id = cd.id
            JOIN tb_user u ON p.user_id = u.id 
            LEFT JOIN (SELECT product_id, AVG(rating) as rating, count(rating) as dibeli from tb_review GROUP BY product_id) rev ON p.id = rev.product_id 
            WHERE p.id = ?`
            db.query(queryStr, id, (err, data) => {
                if (!err) {
                    resolve({
                        status: 200,
                        message: "Get produict by id",
                        data: data
                    })
                } else {
                    reject({
                        status: 500,
                        message: err
                    })
                }
            })
        })
    },
    addNew: (insert_product) => {
        return new Promise((resolve, reject) => {
            const queryStr = "INSERT INTO products SET ?"
            db.query(queryStr, insert_product, (err, data) => {
                if (!err) {
                    resolve(
                        {
                            msg: `data berhasil di insert`
                        }
                    )
                } else {
                    reject(err)
                }
            })
        })
    },
    updateProd: (body, id) => {
        console.log(body, id)
        return new Promise((resolve, reject) => {
            const queryStr = 'UPDATE products SET ? WHERE id = ? '
            db.query(queryStr, [body, id], (err, data) => {
                if (!err) {
                    resolve({
                        msg: `berhasil pada id ${id}`
                    })
                } else {
                    reject(err)
                }
            })
        })
    },
    updateProduct: (id, updatePatch) => {
        return new Promise((resolve, reject) => {
            const queryStr = "UPDATE master SET ? WHERE id = ?"
            db.query(queryStr, [updatePatch, id], (err, data) => {
                if (!err) {
                    resolve({
                        status: 200,
                        msg: `Data berhasil di update`,
                        details: updatePatch
                    })
                } else {
                    reject({
                        status: 500,
                        message: err
                    })
                }
            })
        })
    },
    deleteFile: (id) => {
        return new Promise((resolve, reject) => {
            const queryStr = "SELECT product_img FROM products WHERE id = ?"
            db.query(queryStr, id, (err, data) => {
                if (!err) {
                    resolve(data)
                } else {
                    reject({
                        msg: `Gagal`
                    })
                }
            })
        })
    },
    deleteProd: (id) => {
        return new Promise((resolve, reject) => {
            const queryStr = `DELETE FROM products WHERE id = ?`
            db.query(queryStr, id, (err, data) => {
                if (!err) {
                    resolve({
                        msg: `Data berhasil dihapus pada id ${id}`
                    })
                } else {
                    reject({ msg: `Gagal` })
                }
            })
        })
    },
}