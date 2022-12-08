/**
 * VKU_NPC
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { authenticateUser } = require('../middlewares/authenticate.middleware');
const { authorizePartner } = require('../middlewares/authorize.middleware');

router.get('/partner/:partnerId', productController.productsPartner);
router.post('/', authenticateUser, authorizePartner, productController.create);

module.exports = router;
