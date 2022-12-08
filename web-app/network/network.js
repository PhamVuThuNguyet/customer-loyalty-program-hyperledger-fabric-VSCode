/**
 * VKU_NPC
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

// Import dependencies
require('dotenv').config();
const grpc = require('@grpc/grpc-js');
const { connect, signers } = require('@hyperledger/fabric-gateway');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { TextDecoder } = require('util');

const utf8Decoder = new TextDecoder();

// Environment variables
const channelName = process.env.CHANNEL_NAME;
const chaincodeName = process.env.CHAINCODE_NAME;
const mspId = process.env.MSP_ID;
const peerEndpoint = process.env.PEER_END_POINT;
const peerHostAlias = process.env.PEER_HOST_ALIAS;

//Path to crypto materials
const cryptoPath = path.resolve(__dirname,
    '..',
    '..',
    'test-network',
    'organizations',
    'peerOrganizations',
    'org1.example.com');

//Path to use private key directory
const keyDirectoryPath = path.resolve(cryptoPath,
    'users',
    'User1@org1.example.com',
    'msp',
    'keystore');

//Path to user certificate
const certPath = path.resolve(cryptoPath,
    'users',
    'User1@org1.example.com',
    'msp',
    'signcerts',
    'cert.pem');

//Path to peer tls certificate
const tlsCertPath = path.resolve(cryptoPath,
    'peers',
    'peer0.org1.example.com',
    'tls',
    'ca.crt');


/**
 * Function to generate new client connect to grpc gateway */
async function newGrpcConnection() {
    const tlsRootCert = await fs.readFileSync(tlsCertPath);
    const tlsCredentials = grpc.credentials.createSsl(tlsRootCert);
    return new grpc.Client(peerEndpoint, tlsCredentials, { 'grpc.ssl_target_name_override': peerHostAlias });
}

/**
 * Function to create new Identity for user */
async function newIdentity() {
    const credentials = await fs.readFileSync(certPath);
    return { mspId, credentials };
}

/**
 * Function to create new private key for signer */
async function newSigner() {
    const files = await fs.readdirSync(keyDirectoryPath);
    const keyPath = path.resolve(keyDirectoryPath, files[0]);
    const privateKeyPem = await fs.readFileSync(keyPath);
    const privateKey = crypto.createPrivateKey(privateKeyPem);
    return signers.newPrivateKeySigner(privateKey);
}

async function getContract() {
    const client = await newGrpcConnection();
    const gateway = connect({
        client,
        identity: await newIdentity(),
        signer: await newSigner()
    });

    try {
        const network = gateway.getNetwork(channelName);
        const contract = network.getContract(chaincodeName);
        return contract;
    } catch (err) {
        let error = {};
        error.error = err.message;
        return error;
    }
}


//export module
module.exports = {
    /** Initledger */
    initLedger: async function () {
        let contract = await getContract();

        try {
            await contract.submitTransaction('instantiate');
        } catch (err) {
            let error = {};
            error.error = err.message;
            return error;
        }
    },
    /*
  * Create Member participant and import card for identity
  * @param {String} cardId Import card id for member
  * @param {String} accountNumber Member account number as identifier on network
  * @param {String} firstName Member first name
  * @param {String} lastName Member last name
  * @param {String} phoneNumber Member phone number
  * @param {String} email Member email
  */
    registerMember: async function (cardId, accountNumber, firstName, lastName, email, phoneNumber) {
        let contract = await getContract();

        try {
            await contract.evaluateTransaction('GetSate', accountNumber);
            let error = {};
            error.error = 'Member already exists';
        } catch (err) {
            console.log('OK. Creating...');
        }

        let member = {};
        member.accountNumber = accountNumber;
        member.password = cardId;
        member.firstName = firstName;
        member.lastName = lastName;
        member.email = email;
        member.phoneNumber = phoneNumber;
        member.points = 0;

        try {
            await contract.submitTransaction('CreateMember', JSON.stringify(member));

            let member_success = await contract.evaluateTransaction('GetState', accountNumber);

            console.log('Create member successfully');
            console.log(JSON.parse(utf8Decoder.decode(member_success)));
            return true;
        } catch (err) {
            let error = {};
            error.error = err.message;
            return error;
        }
    },

    /*
  * Create Partner participant and import card for identity
  * @param {String} cardId Import card id for partner
  * @param {String} partnerId Partner Id as identifier on network
  * @param {String} name Partner name
  */
    registerPartner: async function (cardId, partnerId, name) {
        let contract = await getContract();

        try {
            await contract.evaluateTransaction('GetState', partnerId);
            let error = {};
            error.error = 'Partner already exists';
        } catch (err) {
            console.log('OK. Creating...');
        }

        let partner = {};
        partner.id = partnerId;
        partner.name = name;
        partner.password = cardId;

        try {
            await contract.submitTransaction('CreatePartner', JSON.stringify(partner));

            let partner_success = await contract.evaluateTransaction('GetState', partnerId);

            console.log('Create partner successfully');
            console.log(JSON.parse(utf8Decoder.decode(partner_success)));
            return true;
        } catch (err) {
            let error = {};
            error.error = err.message;
            return error;
        }
    },

    /*
  * Perform EarnPoints transaction
  * @param {String} cardId Card id to connect to network
  * @param {String} accountNumber Account number of member
  * @param {String} partnerId Partner Id of partner
  * @param {Integer} points Points value
  */
    earnPointsTransaction: async function (cardId, accountNumber, partnerId, points) {
        let contract = await getContract();

        let earnPoints = {};
        earnPoints.points = points;
        earnPoints.member = accountNumber;
        earnPoints.partner = partnerId;

        try {
            await contract.submitTransaction('EarnPoints', JSON.stringify(earnPoints));
            return true;
        } catch (err) {
            let error = {};
            error.error = err.message;
            return error;
        }
    },

    /*
  * Perform UsePoints transaction
  * @param {String} cardId Card id to connect to network
  * @param {String} accountNumber Account number of member
  * @param {String} partnerId Partner Id of partner
  * @param {Integer} points Points value
  */
    usePointsTransaction: async function (cardId, accountNumber, partnerId, points) {
        let contract = await getContract();

        let usePoints = {};
        usePoints.points = points;
        usePoints.member = accountNumber;
        usePoints.partner = partnerId;

        try {
            await contract.submitTransaction('UsePoints', JSON.stringify(usePoints));
            return true;
        } catch (err) {
            let error = {};
            error.error = err.message;
            return error;
        }
    },

    /*
  * Get Member data
  * @param {String} cardId Card id to connect to network
  * @param {String} accountNumber Account number of member
  */
    memberData: async function (cardId, accountNumber) {
        let contract = await getContract();

        try {
            let member = await contract.evaluateTransaction('GetState', accountNumber);
            member = JSON.parse(utf8Decoder.decode(member));

            if (member.password !== cardId) {
                let error = {};
                error.error = 'Password is incorrect';
                return error;
            }

            return member;
        } catch (err) {
            let error = {};
            error.error = err.message;
            return error;
        }
    },

    /*
  * Get Partner data
  * @param {String} cardId Card id to connect to network
  * @param {String} partnerId Partner Id of partner
  */
    partnerData: async function (cardId, partnerId) {
        let contract = await getContract();
        try {
            let partner = await contract.evaluateTransaction('GetState', partnerId);
            partner = JSON.parse(utf8Decoder.decode(partner));
            if (partner.password !== cardId) {
                let error = {};
                error.error = 'Password is incorrect';
                return error;
            }
            return partner;
        } catch (err) {
            let error = {};
            error.error = err.message;
            return error;
        }
    },

    /*
  * Get all partners data
  * @param {String} cardId Card id to connect to network
  */
    allPartnersInfo: async function (cardId) {
        let contract = await getContract();

        try {
            let allPartners = await contract.evaluateTransaction('GetState', 'all-partners');
            allPartners = JSON.parse(utf8Decoder.decode(allPartners));
            return allPartners;
        } catch (err) {
            let error = {};
            error.error = err.message;
            return error;
        }
    },

    /*
  * Get all EarnPoints transactions data
  * @param {String} cardId Card id to connect to network
  */
    earnPointsTransactionsInfo: async function (cardId, userType, userId) {
        let contract = await getContract();

        try {
            let earnPointsTransactions = await contract.evaluateTransaction('EarnPointsTransactionsInfo', userType, userId);
            earnPointsTransactions = JSON.parse(utf8Decoder.decode(earnPointsTransactions));
            return earnPointsTransactions;
        } catch (err) {
            let error = {};
            error.error = err.message;
            return error;
        }

    },

    /*
  * Get all UsePoints transactions data
  * @param {String} cardId Card id to connect to network
  */
    usePointsTransactionsInfo: async function (cardId, userType, userId) {
        let contract = await getContract();

        try {
            let usePointsTransactions = await contract.evaluateTransaction('UsePointsTransactionsInfo', userType, userId);
            usePointsTransactions = JSON.parse(utf8Decoder.decode(usePointsTransactions));
            return usePointsTransactions;
        } catch (err) {
            let error = {};
            error.error = err.message;
            return error;
        }

    }

};
