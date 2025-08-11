const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');
const controller = new invoiceController();

router.post('/createInvoice', controller.createInvoice.bind(controller));
router.put('/updateInvoice', controller.updateInvoice.bind(controller));
router.get('/getInvoiceAll', controller.getInvoiceAll.bind(controller));
router.delete('/deleteInvoice', controller.deleteInvoice.bind(controller));

module.exports = router;