/**
 * VKU_NPC
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

//stackoverflow
function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

//stackoverflow
function validatePhoneNumber(phoneNumber) {
    const re = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    return re.test(String(phoneNumber));
}

function validateName(name) {
    const re = /^[a-zA-Z\s]*$/;
    return re.test(String(name));
}

function validateLetterAndNumber(str) {
    const re = /^[0-9a-zA-Z]+$/;
    return re.test(str);
}

module.exports = {
    /*
     * Validata member registration fields ensuring the fields meet the criteria
     * @param {String} cardId
     * @param {String} accountNumber
     * @param {String} firstName
     * @param {String} lastName
     * @param {String} phoneNumber
     * @param {String} email
     */
    validateMemberRegistration: async function (
        cardId,
        accountNumber,
        firstName,
        lastName,
        email,
        phoneNumber
    ) {
        let response = {};
        //verify input otherwise return error with an informative message
        if (String(accountNumber).length < 6) {
            response.error = 'Account number must be at least six digits long';
        } else if (!Number.isInteger(Number(accountNumber))) {
            response.error = 'Account number must be all numbers';
            return response;
        } else if (String(accountNumber).length > 25) {
            response.error = 'Account number must be less than 25 digits';
            return response;
        } else if (String(cardId).length < 1) {
            response.error = 'Enter access key';
            return response;
        } else if (!validateLetterAndNumber(cardId)) {
            response.error = 'Card id can be letters and numbers only';
            return response;
        } else if (firstName.length < 1) {
            response.error = 'Enter first name';
            return response;
        } else if (!validateName(firstName)) {
            response.error = 'First name must be letters only';
            return response;
        } else if (lastName.length < 1) {
            response.error = 'Enter last name';
            return response;
        } else if (!validateName(lastName)) {
            response.error = 'Last name must be letters only';
            return response;
        } else if (email.length < 1) {
            response.error = 'Enter email';
            return response;
        } else if (!validateEmail(email)) {
            response.error = 'Enter valid email';
            return response;
        } else if (String(phoneNumber).length < 1) {
            response.error = 'Enter phone number';
            return response;
        } else if (!validatePhoneNumber(phoneNumber)) {
            response.error = 'Enter valid phone number';
            return response;
        }
        return response;
    },

    /*
     * Validata partner registration fields ensuring the fields meet the criteria
     * @param {String} cardId
     * @param {String} partnerId
     * @param {String} name
     */
    validatePartnerRegistration: async function (cardId, partnerId, name) {
        let response = {};

        //verify input otherwise return error with an informative message
        if (String(cardId).length < 1) {
            response.error = 'Enter access key';
            return response;
        } else if (!validateLetterAndNumber(cardId)) {
            response.error = 'Access key can be letters and numbers only';
            return response;
        } else if (partnerId.length < 1) {
            response.error = 'Enter partner id';
            return response;
        } else if (!validateLetterAndNumber(partnerId)) {
            response.error = 'Partner id can be letters and numbers only';
            return response;
        } else if (name.length < 1) {
            response.error = 'Enter company name';
            return response;
        } else if (!validateName(name)) {
            response.error = 'Company name must be letters only';
            return response;
        } else {
            return response;
        }
    },

    validatePoints: async function (points) {
        let response = {};
        //verify input otherwise return error with an informative message
        if (isNaN(points)) {
            response.error = 'Points must be number';
            return response;
        } else {
            return Math.round(points);
        }
    },

    validateProduct: async function ({ name, price, image, partnerId }) {
        const response = {};

        if (String(partnerId).length < 1) {
            response.error = 'Enter partner id';
            return response;
        } else if (name.length < 1) {
            response.error = 'Enter product name';
            return response;
        } else if (isNaN(price)) {
            response.error = 'Price must be number';
            return response;
        } else if (image.length < 1) {
            response.error = 'Enter image url';
            return response;
        }
        return response;
    },
};
