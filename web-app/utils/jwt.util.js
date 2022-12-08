/**
 * VKU_NPC
 * SPDX-License-Identifier: Apache-2.0
 *
 */

'use strict';

require('dotenv').config();
const jwt = require('jsonwebtoken');

const generateToken = (data) => {
    return jwt.sign(
        {
            data,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_TTL }
    );
};

const decodeToken = (token) => {
    try {
        const data = jwt.verify(token, process.env.JWT_SECRET);
        return data;
    } catch (error) {
        return;
    }
};

module.exports = {
    generateToken,
    decodeToken,
};
