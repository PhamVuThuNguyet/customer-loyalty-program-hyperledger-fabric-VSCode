/**
 * VKU_NPC
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const express = require('express');
const router = express.Router();
const memberController = require('../controllers/member.controller');
const { authenticateUser } = require('../middlewares/authenticate.middleware');


router.post('/register', memberController.register);
router.post('/earn-points', authenticateUser, memberController.earnPoints);
router.post('/use-points', authenticateUser, memberController.usePoints);
router.post('/data', memberController.data);

module.exports = router;
