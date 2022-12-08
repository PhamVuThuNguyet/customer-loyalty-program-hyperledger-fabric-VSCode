'use strict';

const express = require('express');
const router = express.Router();
const memberController = require('../controllers/member.controller');

router.post('/register', memberController.register);
router.post('/earn-points', memberController.earnPoints);
router.post('/use-points', memberController.usePoints);
router.post('/data', memberController.data);

module.exports = router;
