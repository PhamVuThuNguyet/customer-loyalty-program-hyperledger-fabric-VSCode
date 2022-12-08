/**
 * VKU_NPC
 * SPDX-License-Identifier: Apache-2.0
 *
 */

'use strict';

const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');

router.get('/partner/:partnerId', productController.productsPartner);
router.post('/', productController.create);

module.exports = router;