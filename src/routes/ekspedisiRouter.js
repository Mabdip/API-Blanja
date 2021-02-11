const express = require('express');
const ekspedisiRouter = express.Router();
const ekspedisiControlller = require('../controllers/ekspedisiController');

ekspedisiRouter.get('/jasa_pengiriman', ekspedisiControlller.getKurir);

module.exports = ekspedisiRouter;