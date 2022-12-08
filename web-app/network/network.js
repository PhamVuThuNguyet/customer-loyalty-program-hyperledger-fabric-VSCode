'use strict';


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
