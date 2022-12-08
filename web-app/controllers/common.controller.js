/**
 * VKU_NPC
 * SPDX-License-Identifier: Apache-2.0
 *
 */

'use strict';

class CommonController {
    async userInfo(req, res) {
        try {
            res.json(req.user);
        } catch (error) {
            res.sendStatus(500);
        }
    }
}

module.exports = new CommonController();
