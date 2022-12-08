/**
 * VKU_NPC
 * SPDX-License-Identifier: Apache-2.0
 *
 */

'use strict';
require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URL = {
    production: `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@hyperledger.up0qxlt.mongodb.net/customerloyalty?retryWrites=true&w=majority`,
    test: `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@hyperledger.up0qxlt.mongodb.net/customerloyalty-test?retryWrites=true&w=majority`,
};

const connectDB = async () => {
    return mongoose.connect(MONGO_URL[process.env.NODE_ENV]);
};

module.exports = connectDB;
