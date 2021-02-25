const notifModel = require ('./../models/notifModel')

module.exports = {
    addNewNotif: (req, res) =>{
        const {body} = req
        notifModel.addNewNotif(body)
        .then((result) => {
            res.status(200).json(result)
        }).catch((error) => {
            res.status(error.status).json(error)
        })
    },
    getNotifSeller: (req, res) =>{
        const {id} = req.params
        notifModel.getNotifSeller(id)
        .then((result) => {
            res.status(200).json(result)
        }).catch((error) => {
            res.status(error.status).json(error)
        })
    },
    getNotifBuyer: (req, res) =>{
        const {id} = req.params
        notifModel.getNotifBuyer(id)
        .then((result) => {
            res.status(200).json(result)
        }).catch((error) => {
            res.status(error.status).json(error)
        })
    }
}