/**
 * VKU_NPC
 * SPDX-License-Identifier: Apache-2.0
 *
 */
'use strict';

const express = require('express');
const router = express.Router();
const viewController = require('../controllers/view.controller');

router.get('/register/partner', viewController.registerPartner);
router.get('/register/member', viewController.registerMember);
router.get('/partner', viewController.partner);
router.get('/member', viewController.member);
router.get('/about', viewController.about);
router.get('/home', viewController.index);
router.get('/', viewController.index);

module.exports = router;
