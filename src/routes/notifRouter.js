const express = require('express')
const notifRouter = express.Router()
const notifController = require('./../controllers/notifController')

notifRouter.post('/add', notifController.addNewNotif)
notifRouter.get('/seller/:id', notifController.getNotifSeller)
notifRouter.get('/buyer/:id', notifController.getNotifBuyer)

module.exports = notifRouter