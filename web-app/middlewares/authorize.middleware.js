/**
 * VKU_NPC
 * SPDX-License-Identifier: Apache-2.0
 *
 */

'use strict';

const authorizeMember = (req, res, next) => {
    const member = req.user;
    if (member.role !== 'member') {
        return res.sendStatus(403);
    }
    next();
};

const authorizePartner = (req, res, next) => {
    const partner = req.user;
    if (partner.role !== 'partner') {
        return res.sendStatus(403);
    }
    next();
};

module.exports = {
    authorizeMember,
    authorizePartner,
};
