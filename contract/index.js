/**
 * VKU_NPC
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const CustomerLoyalty = require('./lib/customerloyalty');

module.exports.CustomerLoyalty = CustomerLoyalty;
module.exports.contracts = [ CustomerLoyalty ];