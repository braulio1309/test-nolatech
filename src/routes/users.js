const express = require('express');
const router = express.Router();
const md_auth = require('../middleware/authenticated');
const UserController = require('../Controllers/UserController');

router.post('/users', UserController.crear);
router.post('/login', UserController.login);
router.get('/users/:page?/:limit?', UserController.show);
router.get('/user/:id', UserController.getOne);
router.put('/user/:id', UserController.update);
router.delete('/users/:id', UserController.delete);

module.exports =  router;
