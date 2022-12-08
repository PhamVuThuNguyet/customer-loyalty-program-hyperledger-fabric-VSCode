/**
 * VKU_NPC
 * SPDX-License-Identifier: Apache-2.0
 *
 */
'use strict';

const app = require('./app');

//declare port
const port = process.env.PORT || 8000;

//run app on port
app.listen(port, function () {
    console.log('app running on port: %d', port);
});
