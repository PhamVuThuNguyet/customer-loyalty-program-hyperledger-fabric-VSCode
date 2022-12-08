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
const keyDirectoryPath = path.resolve(cryptopath,
    'users',
    'User1@org1.example.com',
    'msp',
    'keystore');

//Path to user certificate
const certPath = path.resolve(cryptopath,
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
        identity: await newIdentity();
        signer: await newSigner()
    });

    try {
        const network = gateway.getNetwork(channelName);
        const contract = network.getContract(chaincodeName);
        return contract;
    } catch (err) {
        let error = {}
        error.error = err.message;
        return error;
    }
}


//export module
module.exports = {

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

    },

    /*
  * Create Partner participant and import card for identity
  * @param {String} cardId Import card id for partner
  * @param {String} partnerId Partner Id as identifier on network
  * @param {String} name Partner name
  */
    registerPartner: async function (cardId, partnerId, name) {

    },

    /*
  * Perform EarnPoints transaction
  * @param {String} cardId Card id to connect to network
  * @param {String} accountNumber Account number of member
  * @param {String} partnerId Partner Id of partner
  * @param {Integer} points Points value
  */
    earnPointsTransaction: async function (cardId, accountNumber, partnerId, points) {
    },

    /*
  * Perform UsePoints transaction
  * @param {String} cardId Card id to connect to network
  * @param {String} accountNumber Account number of member
  * @param {String} partnerId Partner Id of partner
  * @param {Integer} points Points value
  */
    usePointsTransaction: async function (cardId, accountNumber, partnerId, points) {

    },

    /*
  * Get Member data
  * @param {String} cardId Card id to connect to network
  * @param {String} accountNumber Account number of member
  */
    memberData: async function (cardId, accountNumber) {

    },

    /*
  * Get Partner data
  * @param {String} cardId Card id to connect to network
  * @param {String} partnerId Partner Id of partner
  */
    partnerData: async function (cardId, partnerId) {

    },

    /*
  * Get all partners data
  * @param {String} cardId Card id to connect to network
  */
    allPartnersInfo: async function (cardId) {

    },

    /*
  * Get all EarnPoints transactions data
  * @param {String} cardId Card id to connect to network
  */
    earnPointsTransactionsInfo: async function (cardId, userType, userId) {


    },

    /*
  * Get all UsePoints transactions data
  * @param {String} cardId Card id to connect to network
  */
    usePointsTransactionsInfo: async function (cardId, userType, userId) {


    }

};
