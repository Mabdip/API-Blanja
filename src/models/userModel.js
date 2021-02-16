const db = require('../config/mySQL')
const bcrypt = require('bcrypt')

module.exports = {
    addReview: (body) =>{
        return new Promise ((resolve, reject) =>{
            const queryStr = `INSERT INTO tb_review SET ?`
            db.query(queryStr, body, (err, data) =>{
                if(!err){
                    resolve({
                        status:200,
                        message:`Berhasil menambahkan review`
                    })
                }else{
                    reject({
                        status:500,
                        message:err
                    })
                }
            })
        })
    },

    getReview: (productId) =>{
        return new Promise ((resolve, reject) =>{
            const queryStr = `SELECT r.id, u.fullname, r.rating, r.review, r.created_at FROM tb_review r JOIN tb_user u ON r.user_id = u.id JOIN products p ON r.product_id = p.id WHERE product_id = ?`
            db.query(queryStr, productId, (err, data) =>{
                if(!err){
                    if(data.length > 0){
                        resolve({
                            status:200,
                            data:data
                        })
                    }else{
                        resolve({
                            status:404,
                            data:`Belum ada review`
                        })
                    }
                }else{
                    reject({
                        status:500,
                        message:err
                    })
                }
            })
        })
    },
    getUserDetails: (id) =>{
        return new Promise ((resolve, reject) =>{
            const queryStr = `SELECT email, fullname, photo, storeName FROM tb_user WHERE id = ?`
            db.query(queryStr, id, (err, data) =>{
                if(!err){
                    resolve({
                        status:200,
                        data:data[0]
                    })
                }else{
                    reject({
                        status:500,
                        message:err
                    })
                }
            })
        })
    },

    //iseng, belum dicoba
    addFavourite : (bookmarkData) => {
        return new Promise ((resolve, reject) =>{
            const queryStr = `INSERT INTO tb_favourite SET ?`
            db.query(queryStr,bookmarkData, (err, data) =>{
                if(!err){
                    resolve({
                        status:200
                    })
                }else{
                    reject({
                        status:500,
                        message:err
                    })
                }
            })
        })
    },
    getFavouriteUser: (userId) => {
        return new Promise ((resolve, reject) =>{
            
        })
    },

    changePassword: (body) => {
        return new Promise((resolve, reject) => {
            const { email, old_password, new_password } = body
            const queryStr = `SELECT password FROM tb_user WHERE email = ?`
            db.query(queryStr, email, (err, data) => {
                if (!err) {
                    if (data.length > 0) {
                        bcrypt.compare(old_password, data[0].password, (error, result) => {
                            if (error) {
                                reject({
                                    status: 500,
                                    message: error
                                })
                            }
                            if (!result) {
                                reject({
                                    status: 401,
                                    message: 'Password salah'
                                })
                            } else {
                                const saltRounds = Math.floor(Math.random() * 10) + 1
                                bcrypt.hash(new_password, saltRounds, (errorHash, hashedPassword) => {
                                    if (errorHash) {
                                        reject({
                                            statu: 500,
                                            message: errorHash
                                        })
                                    } else {
                                        const updatePassword = `UPDATE tb_user SET password = ? WHERE email = ?`
                                        db.query(updatePassword, [hashedPassword, email], (errorUpdate, dataUpdate) => {
                                            if (!errorUpdate) {
                                                resolve({
                                                    status: 200,
                                                    message: `Change Password , berhasil`
                                                })
                                            }else{
                                                reject({
                                                    status:500,
                                                    message:errorUpdate
                                                })
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    } else {
                        reject({
                            status: 404,
                            message: `data tidak ditemukan`
                        })
                    }
                }else{
                    reject({
                        status:500,
                        message:err
                    })
                }
            })
        })
    },

    getNameUser : (id) =>{
        return new Promise ((resolve, reject) =>{
            const queryStr = `SELECT fullname FROM tb_user WHERE id = ?`
            db.query(queryStr, id, (err, data) =>{
                console.log(err, data)
                if(!err){
                    resolve({
                        status:200,
                        data:data[0]
                    })
                }else{
                    reject({
                        status:500,
                        data:err
                    })
                }
            })
        })
    }

    
}