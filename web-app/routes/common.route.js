/**
 * VKU_NPC
 * SPDX-License-Identifier: Apache-2.0
 *
 */

'use strict';

const express = require('express');
const router = express.Router();
const commonController = require('../controllers/common.controller');
const { authenticateUser } = require('../middlewares/authenticate.middleware');

router.get('/user-info', authenticateUser, commonController.userInfo);

module.exports = router;
