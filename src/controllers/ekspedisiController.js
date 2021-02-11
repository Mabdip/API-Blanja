const kurirRouter = require('../routes/ekspedisiRouter')
const ekspedisiModel = require('../models/ekspedisiModel')

module.exports = {
    getKurir: (req, res) =>{
        ekspedisiModel.getKurirData()
        .then((result) =>{
            res.status(200).json(result)
        }).catch((error) =>{
            res.status(error.status).json(error)
        })
    }
}