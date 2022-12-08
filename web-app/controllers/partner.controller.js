/**
 * VKU_NPC
 * SPDX-License-Identifier: Apache-2.0
 *
 */
'use strict';

//get the libraries to call
const network = require('../network/network.js');
const validate = require('../network/validate.js');
const analysis = require('../network/analysis.js');
const { generateToken } = require('../utils/jwt.util');

class PartnerController {
    /**
     * @dev [POST] /api/partner/register
     * @notice API to create new partner
     * @param {*} req Request from client
     * @param {*} res Response to client
     * @returns status 201 if successful, 400 if error in validation, 409 if conflict, 500 for other errors
     */
    async register(req, res) {
        try {
            const { name, cardid } = req.body;
            let partnerid = req.body.partnerid;

            const validation = await validate.validatePartnerRegistration(
                cardid,
                partnerid,
                name
            );

            partnerid = 'P' + partnerid;

            if (validation.error) {
                res.statusMessage = validation.error;
                return res.sendStatus(400);
            }

            const response = await network.registerPartner(
                cardid,
                partnerid,
                name
            );
            if (response.error) {
                res.statusMessage = response.error;
                return res.sendStatus(400);
            }

            res.sendStatus(201);
        } catch (error) {
            res.sendStatus(500);
        }
    }

    /**
     * @dev [POST] /api/partners/data
     * @notice API for login and get partner data
     * @param {*} req Request from client
     * @param {*} res Response to client
     * @returns status 200 if successful, 400 if error in validation, 500 for other errors
     */
    async data(req, res) {
        try {
            const { cardid } = req.body;
            const partnerid = 'P' + req.body.partnerid;

            const returnData = {};

            const [
                partner,
                usePointsResults,
                earnPointsResults,
            ] = await Promise.all([
                network.partnerData(cardid, partnerid),
                network.usePointsTransactionsInfo(cardid, 'partner', partnerid),
                network.earnPointsTransactionsInfo(
                    cardid,
                    'partner',
                    partnerid
                ),
            ]);

            if (
                partner.error ||
                usePointsResults.error ||
                earnPointsResults.error
            ) {
                res.statusMessage =
                    partner.error ||
                    usePointsResults.error ||
                    earnPointsResults.error;
                return res.sendStatus(400);
            }

            returnData.id = partner.id;
            returnData.name = partner.name;
            returnData.usePointsResults = usePointsResults;
            //add total points collected by partner to return object
            returnData.pointsCollected = analysis.totalPointsCollected(
                usePointsResults
            );
            returnData.earnPointsResults = earnPointsResults;
            //add total points given by partner to return object
            returnData.pointsGiven = analysis.totalPointsGiven(
                earnPointsResults
            );
            returnData.token = generateToken({
                id: partnerid,
                cardid,
                role: 'member',
            });
            res.json(returnData);
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    }
}

module.exports = new PartnerController();
