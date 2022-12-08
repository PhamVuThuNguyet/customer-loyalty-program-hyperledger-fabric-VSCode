/**
 * VKU_NPC
 * SPDX-License-Identifier: Apache-2.0
 */
'use strict';

const validate = require('../network/validate.js');
const Product = require('../models/Product');

class ProductController {
    /**
     * @dev [GET] /api/products/partner/:partnerId
     * @notice API for getting list products of partner
     * @param {*} req Request from client
     * @param {*} res Response to client
     * @returns status 200 and list products if successful, 500 for errors
     */
    async productsPartner(req, res) {
        try {
            const partnerId = req.params.partnerId;
            const products = await Product.find({ partnerId });
            res.json(products);
        } catch (error) {
            res.sendStatus(500);
        }
    }

    /**
     * @dev /api/products
     * @notice API to upload product for partner
     * @param {*} req Request from client
     * @param {*} res Response to client
     * @returns status 201 if successful, 500 if errors
     */
    async create(req, res) {
        try {
            const validation = await validate.validateProduct(req.body);
            if (validation.error) {
                res.statusCode = 400;
                res.statusMessage = validation.error;
                return res.send();
            }
            await Product.create(req.body);
            res.sendStatus(201);
        } catch (error) {
            res.sendStatus(500);
        }
    }
}

module.exports = new ProductController();
