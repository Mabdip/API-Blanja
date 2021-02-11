const db = require('../config/mySQL')

module.exports = {
    postNewAddress: (body) => {
        return new Promise((resolve, reject) => {
            const queryStr = `INSERT INTO address SET ?`
            db.query(queryStr, body, (err, data) => {
                if (!err) {
                    resolve({
                        status: 200,
                        message: `Sukses menambahkan alamat baru`
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
    changeAddress: (body, addressId) => {
        return new Promise((resolve, reject) => {
            const queryStr = `UPDATE address SET ? WHERE id = ?`
            db.query(queryStr, [body, addressId], (err, data) => {
                if (!err) {
                    resolve({
                        status: 200,
                        message: `Alamat berhasil diubah`
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
    getAddress: (id) => {
        return new Promise((resolve, reject) => {
            const queryStr = `SELECT id, address_type, recipient_name, address, city, postal, phone, address_type FROM address WHERE user_id = ?`
            db.query(queryStr, id, (err, data) => {
                if (!err) {
                    if (data[0]) {
                        resolve({
                            status: 200,
                            data: data
                        })
                    } else {
                        resolve({
                            status: 404,
                            data: `Data not Found`
                        })
                    }
                } else {
                    reject({
                        error: 500,
                        message: err
                    })
                }
            })
        })
    },
    getAddressbyId: (id) => {
        return new Promise((resolve, reject) => {
            const queryStr = `SELECT * FROM address WHERE id = ?`
            db.query(queryStr, id, (err, data) => {
                if (!err) {
                    if (data[0]) {
                        resolve({
                            status: 200,
                            message: 'data ditemukan',
                            data: data[0]
                        })
                    } else {
                        reject({
                            status: 404,
                            message: 'data tidak ditemukan',
                            data: 'NOT FOUND'
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
    deleteAddressId: (id) => {
        return new Promise((resolve, reject) => {
            const queryStr = `DELETE FROM address WHERE id = ?`
            db.query(queryStr, id, (err, data) => {
                if (!err) {
                    resolve({
                        status: 200,
                        message: 'alamat berhasil dihapus'
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
}