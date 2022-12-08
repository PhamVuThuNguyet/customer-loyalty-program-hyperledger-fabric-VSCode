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

class PartnerController {
    async register(req, res) {
        try {
            const { name, partnerid, cardid } = req.body;

            const validation = validate.validatePartnerRegistration(
                cardid,
                partnerid,
                name
            );

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

    async data(req, res) {
        try {
            const { partnerid, cardid } = req.body;

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
            res.json(returnData);
        } catch (error) {
            res.sendStatus(500);
        }
    }
}

module.exports = new PartnerController();
