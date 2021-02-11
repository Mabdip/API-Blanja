const express = require('express');

const welcomeRouter = express.Router();

welcomeRouter.get('/', (req, res) => {
    res.send('Backend Blanja');
})

//handler endpoint
module.exports = welcomeRouter;