/**
 * VKU_NPC
 * SPDX-License-Identifier: Apache-2.0
 *
 */

'use strict';

/**
 * @notice Authorize user
 * @param {*} req Request from client
 * @param {*} res Response to client
 * @param {*} next Next function
 * @returns 403 if not authorization
 */
const authorizeMember = (req, res, next) => {
    const member = req.user;
    if (member.role !== 'member') {
        return res.sendStatus(403);
    }
    next();
};

/**
 * @notice Authorize partner
 * @param {*} req Request from client
 * @param {*} res Response to client
 * @param {*} next Next function
 * @returns 403 if not authorization
 */
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
