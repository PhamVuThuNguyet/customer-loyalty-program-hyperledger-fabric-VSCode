/**
 * VKU_NPC
 * SPDX-License-Identifier: Apache-2.0
 */
'use strict';

const appRoot = process.cwd();

class ViewController {
    /**
     * @dev [GET] /, /home
     * @notice API to render index page
     * @param {*} req Request from client
     * @param {*} res Response to client
     * @returns index page
     */
    index(req, res) {
        res.sendFile(appRoot + '/public/index.html');
    }

    /**
     * @dev [GET] /member
     * @notice API to render member page
     * @param {*} req Request from client
     * @param {*} res Response to client
     * @returns member page
     */
    member(req, res) {
        res.sendFile(appRoot + '/public/member.html');
    }

    /**
     * @dev [GET] /register/member
     * @notice API to render register member page
     * @param {*} req Request from client
     * @param {*} res Response to client
     * @returns register member page
     */
    registerMember(req, res) {
        res.sendFile(appRoot + '/public/registerMember.html');
    }

    /**
     * @dev [GET] /register/partner
     * @notice API to render register partner page
     * @param {*} req Request from client
     * @param {*} res Response to client
     * @returns register partner page
     */
    registerPartner(req, res) {
        res.sendFile(appRoot + '/public/registerPartner.html');
    }

    /**
     * @dev [GET] /partner
     * @notice API to render partner page
     * @param {*} req Request from client
     * @param {*} res Response to client
     * @returns partner page
     */
    partner(req, res) {
        res.sendFile(appRoot + '/public/partner.html');
    }

    /**
     * @dev [GET] /about
     * @notice API to render about page
     * @param {*} req Request from client
     * @param {*} res Response to client
     * @returns about page
     */
    about(req, res) {
        res.sendFile(appRoot + '/public/about.html');
    }
}

module.exports = new ViewController();
