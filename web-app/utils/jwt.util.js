/**
 * VKU_NPC
 * SPDX-License-Identifier: Apache-2.0
 *
 */

'use strict';

require('dotenv').config();
const jwt = require('jsonwebtoken');

/**
 * @notice Used to generate token from parameter
 * @param {*} data Data to encode to token
 * @returns encode token
 */
const generateToken = (data) => {
    return jwt.sign(
        {
            data,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_TTL }
    );
};

/**
 * @notice Decode token
 * @param {*} token String that will be decoded
 * @returns decoded token => data
 */
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
