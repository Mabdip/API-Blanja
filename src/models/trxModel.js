const db = require('../config/mySQL')
const bcrypt = require('bcrypt')
const jsonwebtoken = require('jsonwebtoken')
const { stat } = require('fs')

module.exports = {
    addTrx: (body) => {
        return new Promise((resolve, reject) => {
            const queryStr = `INSERT INTO tb_transaksi SET ?`
            db.query(queryStr, body, (err, data) => {
                if (!err) {
                    resolve({
                        status: 200,
                        message: `Transaksi berhasil dilakukan`
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

    addOrder: (body) => {
        return new Promise((resolve, reject) => {
            let status = 200;
            let errData = null
            body.map((items) => {
                console.log(items)
                const queryStr = `INSERT INTO tb_item_order SET ?`
                db.query(queryStr, items, (err, data) => {

                    if (!err) {
                        if (status != 500) {
                            status = 200
                            console.log('berhasil')
                        }
                    } else {
                        status = 500
                        errData = err
                        console.log('gagal')
                    }
                })
            })
            if (status == 200) {
                resolve({
                    status: 200,
                    message: `Berhasil insert data`
                })
            } else {
                reject({
                    status: 500,
                    message: errData
                })
            }
        })
    },
    getTotalTrans: (userId) => {
        return new Promise((resolve, reject) => {
            const queryStr = `SELECT COUNT(trxId) as total_order FROM tb_transaksi WHERE user_id = ?`
            db.query(queryStr, userId, (err, data) => {
                if (!err) {
                    resolve({
                        status: 200,
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
    getMyTrans: (userId) => {
        return new Promise((resolve, reject) => {
            const queryStr = `SELECT t.user_id, t.trxId, t.trackingNumber, t.qty,t.total,t.status as status_id, s.status, t.created_at FROM tb_transaksi t JOIN status_pengiriman s ON t.status = s.id WHERE t.user_id = ?`
            db.query(queryStr, userId, (err, data) => {
                if (!err) {
                    if (data.length > 0) {
                        resolve({
                            status: 200,
                            data: data
                        })
                    } else {
                        resolve({
                            status: 200,
                            message: 'Belum ada transaksi',
                            data: []
                        })
                    }
                } else {
                    reject({
                        status: 500,
                        message: err
                    })
                }
            })
        })
    },

    getTransDetails: (trxId) => {
        return new Promise((resolve, reject) => {
            const queryStr = `SELECT * FROM tb_transaksi JOIN address ON tb_transaksi.address = address.id JOIN payment ON tb_transaksi.payment = payment.id JOIN jenis_pengiriman ON tb_transaksi.kurir = jenis_pengiriman.id WHERE trxId = ?`
            db.query(queryStr, trxId, (err, data) => {
                if (!err) {
                    if (data.length > 0) {
                        resolve({
                            status: 200,
                            data: data[0]
                        })
                    } else {
                        resolve({
                            status: 404,
                            data: `NOT FOUND`
                        })
                    }
                } else {
                    reject({
                        status: 500,
                        message: err
                    })
                }
            })
        })
    },

    getOrderDetails: (trxId) => {
        return new Promise((resolve, reject) => {
            const queryStr = `SELECT * FROM tb_item_order WHERE trxId = ?`
            db.query(queryStr, trxId, (err, data) => {
                if (!err) {
                    if (data.length > 0) {
                        resolve({
                            status: 200,
                            data: data
                        })
                    } else {
                        resolve({
                            status: 404,
                            data: `NOT FOUND`
                        })
                    }
                } else {
                    reject({
                        status: 500,
                        message: err
                    })
                }
            })
        })
    },

    getItemtoReview: (trxId) => {
        return new Promise((resolve, reject) => {
            const queryStr = `SELECT * FROM tb_item_order WHERE trxId = ? AND isReviewed = 0`
            db.query(queryStr, trxId, (err, data) => {
                if (!err) {
                    if (data.length > 0) {
                        resolve({
                            status: 200,
                            data: data
                        })
                    } else {
                        resolve({
                            status: 404,
                            data: `NOT FOUND`
                        })
                    }
                } else {
                    reject({
                        status: 500,
                        message: err
                    })
                }
            })
        })
    },
    changeStatusOrder : (status, trxid) =>{
        return new Promise ((resolve, reject) =>{
            const queryStr = `UPDATE tb_transaksi SET status = ? WHERE TrxId = ?`
            db.query(queryStr, [status, trxid], (err, data) =>{
                if(!err){
                    resolve({
                        status:200,
                        message:'berhasil'
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
    getSellerOrderData :() => {
        return new Promise((resolve, reject) => {
            const queryStr = `SELECT t.user_id, t.trxId, t.trackingNumber, t.qty,t.total,t.status as status_id, s.status, t.created_at FROM tb_transaksi t JOIN status_pengiriman s ON t.status = s.id ORDER BY t.created_at DESC `
            db.query(queryStr, (err, data) => {
                if (!err) {
                    if (data.length > 0) {
                        resolve({
                            status: 200,
                            data: data
                        })
                    } else {
                        resolve({
                            status: 200,
                            message: 'Belum ada transaksi',
                            data: []
                        })
                    }
                } else {
                    reject({
                        status: 500,
                        message: err
                    })
                }
            })
        })
    },
    updateResi: (trxid, trackingnumber) =>{
        return new Promise ((resolve, reject) =>{
            const queryStr = `UPDATE tb_transaksi SET trackingNumber = ? WHERE TrxId = ?`
            db.query(queryStr, [trackingnumber,trxid], (err, data) =>{
                if(!err){
                    resolve({
                        status:200,
                        message:'berhasil'
                    })
                }else{
                    reject({
                        status:500,
                        message:err
                    })
                }
            })
        })
    }
}