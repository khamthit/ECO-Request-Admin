const express = require('express');
const router = express.Router();
const portdischargerController = require('../controllers/portdischargerController');
const controller = new portdischargerController();
router.get('/getData', controller.getportdischarger.bind(controller));
router.post('/newportdischarger', controller.newportdischarger.bind(controller));
router.put('/updateportdischarger', controller.updateportdischarger.bind(controller));
router.delete('/deleteportdischargerbyId', controller.deleteportdischarger.bind(controller));

module.exports = router;