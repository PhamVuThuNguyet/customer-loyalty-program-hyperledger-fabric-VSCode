/**
 * VKU_NPC
 * SPDX-License-Identifier: Apache-2.0
 *
 */
'use strict';

const express = require('express');
const router = express.Router();
const viewRoute = require('./view.route');
const partnerRoute = require('./partner.route');
const memberRoute = require('./member.route');

const defaultRoutes = [
    {
        route: memberRoute,
        path: '/api/members',
    },
    {
        route: partnerRoute,
        path: '/api/partners',
    },
    {
        route: viewRoute,
        path: '/',
    },
];

defaultRoutes.map((route) => router.use(route.path, route.route));

module.exports = router;
