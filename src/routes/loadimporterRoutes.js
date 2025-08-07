const express = require('express');
const router = express.Router();

const loadimporterController = require('../controllers/loadimporterController');
const controller = new loadimporterController();
// Route to create a new user
router.post('/newLoadImporter', controller.createLoadImporter.bind(controller));
router.put('/updateLoadImporter', controller.updateLoadImporter.bind(controller));
router.delete('/deleteLoadImporter', controller.deleteLoadImporter.bind(controller));
router.get('/getData', controller.getloadimporter.bind(controller));

module.exports = router;