/**
 * VKU_NPC
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const express = require('express');
const router = express.Router();
const partnerController = require('../controllers/partner.controller');

router.post('/register', partnerController.register);
router.post('/data', partnerController.data);

module.exports = router;
