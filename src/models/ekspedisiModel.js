const db = require('../config/mySQL')

module.exports = {
    getKurirData: () =>{
        return new Promise ((resolve, reject) =>{
            const queryStr = `SELECT id,nama_kurir, waktu, tarif FROM jenis_pengiriman`
            db.query(queryStr, (err, data) =>{
                if(!err){
                    if(data.length > 0){
                        resolve({
                            status:200,
                            data:data
                        })
                    }else{
                        reject({
                            status:404,
                            data:'notfound'
                        })
                    }
                }else{
                    reject({
                        status:500,
                        err:err
                    })
                }
            })
        })
    },
}
