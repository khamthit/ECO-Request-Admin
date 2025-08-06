const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');

const userclientsController = require('../controllers/userclientController');
const controller = new userclientsController();


router.post('/login', controller.userclientlogin.bind(controller));
router.post('/newuserAdmin', authMiddleware, controller.newuserAdmin.bind(controller));
router.put('/updatepassword', authMiddleware, controller.updatepassword.bind(controller));
router.get('/getuserall', authMiddleware, controller.getuserall.bind(controller));

module.exports = router;