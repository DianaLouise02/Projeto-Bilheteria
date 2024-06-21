const express = require('express');
const routerCombined = express.Router();
const combinedController = require('../controller/combinedController');



routerCombined.get('/combined', combinedController.getCombinedData);

module.exports = routerCombined;
