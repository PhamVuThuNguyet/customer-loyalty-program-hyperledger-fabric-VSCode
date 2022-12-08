/**
 * VKU_NPC
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
    partnerId: { type: String, required: true, index: true },
    name: { type: String, required: true, index: true },
    image: { type: String },
    price: { type: Number, required: true },
});

module.exports = mongoose.model('Product', productSchema);
