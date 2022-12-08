/**
 * VKU_NPC
 * SPDX-License-Identifier: Apache-2.0
 *
 */
'use strict';

//get libraries
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

//create express web-app
const app = express();

//get the libraries to call
const network = require('./network/network.js');
const validate = require('./network/validate.js');
const analysis = require('./network/analysis.js');

//bootstrap application settings
app.use(express.static('./public'));
app.use('/scripts', express.static(path.join(__dirname, '/public/scripts')));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//get home page
app.get('/home', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

//get member page
app.get('/member', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/member.html'));
});

//get member registration page
app.get('/registerMember', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/registerMember.html'));
});

//get partner page
app.get('/partner', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/partner.html'));
});

//get partner registration page
app.get('/registerPartner', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/registerPartner.html'));
});

//get about page
app.get('/about', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/about.html'));
});

//post call to register member on the network
app.post('/api/registerMember', async function (req, res) {
    try {
        const {
            accountnumber,
            cardid,
            firstname,
            lastname,
            email,
            phonenumber,
        } = req.body;

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
});

//post call to register partner on the network
app.post('/api/registerPartner', async function (req, res) {
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

        const response = await network.registerPartner(cardid, partnerid, name);
        if (response.error) {
            res.statusMessage = response.error;
            return res.sendStatus(400);
        }

        res.sendStatus(201);
    } catch (error) {
        res.sendStatus(500);
    }
});

//post call to perform EarnPoints transaction on the network
app.post('/api/earnPoints', async function (req, res) {
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
});

//post call to perform UsePoints transaction on the network
app.post('/api/usePoints', async function (req, res) {
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
});

//post call to retrieve member data, transactions data and partners to perform transactions with from the network
app.post('/api/memberData', async function (req, res) {
    try {
        const { accountnumber, cardid } = req.body;
        //declare variables to retrieve from request

        const returnData = {};

        const [
            member,
            usePointsResults,
            earnPointsResults,
            partnersInfo,
        ] = await Promise.all([
            network.memberData(cardid, accountnumber),
            network.usePointsTransactionsInfo(cardid, 'member', accountnumber),
            network.earnPointsTransactionsInfo(cardid, 'member', accountnumber),
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

        res.json(returnData);
    } catch (error) {
        res.sendStatus(500);
    }
});

//post call to retrieve partner data and transactions data from the network
app.post('/api/partnerData', async function (req, res) {
    //declare variables to retrieve from request
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
            network.earnPointsTransactionsInfo(cardid, 'partner', partnerid),
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
        returnData.pointsGiven = analysis.totalPointsGiven(earnPointsResults);
        res.json(returnData);
    } catch (error) {
        res.sendStatus(500);
    }
});

//declare port
const port = process.env.PORT || 8000;

//run app on port
app.listen(port, function () {
    console.log('app running on port: %d', port);
});
