/**
 * VKU_NPC
 * SPDX-License-Identifier: Apache-2.0
 *
 */
'use strict';

const appRoot = process.cwd();

class ViewController {
    index(req, res) {
        res.sendFile(appRoot + '/public/index.html');
    }

    member(req, res) {
        res.sendFile(appRoot + '/public/member.html');
    }

    registerMember(req, res) {
        res.sendFile(appRoot + '/public/registerMember.html');
    }

    registerPartner(req, res) {
        res.sendFile(appRoot + '/public/registerPartner.html');
    }

    partner(req, res) {
        res.sendFile(appRoot + '/public/partner.html');
    }

    about(req, res) {
        res.sendFile(appRoot + '/public/about.html');
    }
}

module.exports = new ViewController();
