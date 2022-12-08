/**
 * VKU_NPC
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

//get the libraries to call
const network = require('../network/network.js');
const validate = require('../network/validate.js');
const { generateToken } = require('../utils/jwt.util');

class MemberController {
    /**
     * @dev [POST] /api/members/register
     * @notice API to create new member
     * @param {*} req Request from client
     * @param {*} res Response to client
     * @returns status 201 if successful, 400 if error in validation, 409 if conflict, 500 for other errors
     */
    async register(req, res) {
        try {
            const {
                cardid,
                firstname,
                lastname,
                email,
                phonenumber,
            } = req.body;

            let accountnumber = req.body.accountnumber;

            const validation = await validate.validateMemberRegistration(
                cardid,
                accountnumber,
                firstname,
                lastname,
                email,
                phonenumber
            );
            if (validation.error) {
                res.statusMessage = validation.error;
                return res.sendStatus(400);
            }

            accountnumber = 'M' + accountnumber;

            const response = await network.registerMember(
                cardid,
                accountnumber,
                firstname,
                lastname,
                email,
                phonenumber
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
     * @dev [POST] api/members/earn-points
     * @notice API for member buy products and earn points
     * @param {*} req Request from client
     * @param {*} res Response to client
     * @returns status 200 if successful, 400 if error in validation, 500 for other errors
     */
    async earnPoints(req, res) {
        try {
            const { accountnumber, cardid, partnerid } = req.body;
            //declare variables to retrieve from request
            const points = parseFloat(req.body.points);

            const checkPoints = await validate.validatePoints(points);
            if (checkPoints.error) {
                res.statusMessage = checkPoints.error;
                return res.sendStatus(400);
            }

            const response = await network.earnPointsTransaction(
                cardid,
                accountnumber,
                partnerid,
                checkPoints
            );

            if (response.error) {
                res.statusMessage = response.error;
                return res.sendStatus(400);
            }
            res.sendStatus(200);
        } catch (error) {
            res.sendStatus(500);
        }
    }

    /**
     * @dev [POST] api/members/use-points
     * @notice API for member buy products by using points
     * @param {*} req Request from client
     * @param {*} res Response to client
     * @returns status 200 if successful, 400 if error in validation, 500 for other errors
     */
    async usePoints(req, res) {
        try {
            const { accountnumber, cardid, partnerid } = req.body;
            const points = parseFloat(req.body.points);

            const checkPoints = await validate.validatePoints(points);
            if (checkPoints.error) {
                res.statusMessage = checkPoints.error;
                return res.sendStatus(400);
            }

            const response = await network.usePointsTransaction(
                cardid,
                accountnumber,
                partnerid,
                checkPoints * 10
            );

            if (response.error) {
                res.statusMessage = response.error;
                return res.sendStatus(400);
            }
            res.sendStatus(200);
        } catch (error) {
            res.sendStatus(500);
        }
    }

    /**
     * @dev [POST] /api/members/data
     * @notice API for login and get member data
     * @param {*} req Request from client
     * @param {*} res Response to client
     * @returns status 200 if successful, 400 if error in validation, 500 for other errors
     */
    async data(req, res) {
        try {
            const { cardid } = req.body;
            const accountnumber = 'M' + req.body.accountnumber;

            const returnData = {};

            const [
                member,
                usePointsResults,
                earnPointsResults,
                partnersInfo,
            ] = await Promise.all([
                network.memberData(cardid, accountnumber),
                network.usePointsTransactionsInfo(
                    cardid,
                    'member',
                    accountnumber
                ),
                network.earnPointsTransactionsInfo(
                    cardid,
                    'member',
                    accountnumber
                ),
                network.allPartnersInfo(cardid),
            ]);

            if (
                member.error ||
                usePointsResults.error ||
                earnPointsResults.error ||
                partnersInfo.error
            ) {
                res.statusMessage =
                    member.error ||
                    usePointsResults.error ||
                    earnPointsResults.error ||
                    partnersInfo.error;
                return res.sendStatus(400);
            }

            returnData.accountNumber = member.accountNumber;
            returnData.firstName = member.firstName;
            returnData.lastName = member.lastName;
            returnData.phoneNumber = member.phoneNumber;
            returnData.email = member.email;
            returnData.points = member.points;
            returnData.usePointsResults = usePointsResults;
            returnData.earnPointsResult = earnPointsResults;
            returnData.partnersData = partnersInfo;
            returnData.token = generateToken({
                id: accountnumber,
                cardid,
                role: 'member',
            });

            res.json(returnData);
        } catch (error) {
            res.sendStatus(500);
        }
    }
}

module.exports = new MemberController();
