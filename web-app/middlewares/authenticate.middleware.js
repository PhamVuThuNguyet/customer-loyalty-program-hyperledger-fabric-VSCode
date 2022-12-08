/**
 * VKU_NPC
 * SPDX-License-Identifier: Apache-2.0
 *
 */

'use strict';

const { decodeToken } = require('../utils/jwt.util');

/**
 * @notice Authenticate user
 * @param {*} req Request from client
 * @param {*} res Response to client
 * @param {*} next Next function
 * @returns 401 if not authenticate
 */
const authenticateUser = (req, res, next) => {
    const token =
        req.headers.authorization &&
        req.headers.authorization.split(' ')[1].replace('\r\n', '');
    if (!token) {
        res.statusMessage = 'No token provider';
        return res.sendStatus(401);
    }

    const decodedToken = decodeToken(token);
    if (decodedToken) {
        req.user = decodedToken.data;
        next();
    } else {
        res.statusMessage = 'Invalid token';
        return res.sendStatus(401);
    }
};

module.exports = {
    authenticateUser,
};
