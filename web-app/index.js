/**
 * VKU_NPC
 * SPDX-License-Identifier: Apache-2.0
 *
 */
'use strict';

const app = require('./app');
const network = require('./network/network');
const connectDB = require('./conf/database.conf.js');

//declare port
const port = process.env.PORT || 8000;

//run app on port
connectDB().then(() => {
    app.listen(port, async function () {
        await network.initLedger();
        console.log('app running on port: %d', port);
    });
});

module.exports = app;
